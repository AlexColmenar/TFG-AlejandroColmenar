import { pedidos } from '../models/pedidos.js';
import { detalles_pedidos } from '../models/detalles_pedidos.js';
import { productos } from '../models/productos.js';
import { usuarios } from '../models/usuarios.js';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import { emailCompra } from './emailController.js';
import { dibujarFactura } from './facturaController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtiene y muestra los productos del carrito pendiente del usuario autenticado
const carrito = async (req, res) => {
    // Obtenemos el ID del usuario de las variables locales puestas por el middleware
    const usuarioId = res.locals.usuario ? res.locals.usuario.id : null;

    // Si no está logueado, le obligamos a iniciar sesión primero
    if (!usuarioId) {
        return res.redirect('/login');
    }

    try {
        // Buscamos si el usuario tiene una cesta de la compra abierta (estado "pendiente")
        // Traemos también todos los detalles (líneas) y la información del producto de cada línea
        const miPedido = await pedidos.findOne({
            where: {
                usuario_id: usuarioId,
                estado: 'pendiente'
            },
            include: [
                {
                    model: detalles_pedidos,
                    as: 'detalles',
                    include: [
                        {
                            model: productos
                        }
                    ]
                }
            ]
        });

        // Pintamos la pantalla del carrito pasándole los datos encontrados (o nulo si está vacío)
        res.render('carrito', {
            pagina: 'Tu Carrito',
            pedido: miPedido
        });

    } catch (error) {
        console.log(error);
        res.render('carrito', { pagina: 'Tu Carrito', pedido: null });
    }
}

// Añade un nuevo producto al carrito o aumenta su cantidad si ya existía
const agregarCarrito = async (req, res) => {
    // Sacamos el ID del producto de la URL y la cantidad que viene del formulario POST
    const { id } = req.params;
    let { cantidad } = req.body;
    cantidad = parseInt(cantidad); // Lo pasamos a número para poder sumar

    const usuarioId = res.locals.usuario.id;

    try {
        //  Verificamos que el producto solicitado existe en la tienda
        const producto = await productos.findByPk(id);
        if (!producto) return res.redirect('/productos');

        //  Buscamos el pedido activo ("pendiente") del usuario
        let pedido = await pedidos.findOne({
            where: { usuario_id: usuarioId, estado: 'pendiente' }
        });

        // Si es el primer producto que añade, creamos un pedido nuevo
        if (!pedido) {
            pedido = await pedidos.create({
                usuario_id: usuarioId,
                fecha: new Date(),
                total: 0,
                estado: 'pendiente'
            });
        }

        // Comprobamos si este producto en concreto ya estaba dentro del pedido actual
        const detalleExistente = await detalles_pedidos.findOne({
            where: { pedido_id: pedido.id, producto_id: id }
        });

        if (detalleExistente) {
            // Si ya estaba, le sumamos las nuevas unidades y recalculamos lo que vale esa línea
            detalleExistente.cantidad += cantidad;
            detalleExistente.subtotal = detalleExistente.cantidad * producto.precio;
            await detalleExistente.save();
        } else {
            // Si es un producto nuevo en el carrito, creamos una nueva línea de detalle
            await detalles_pedidos.create({
                pedido_id: pedido.id,
                producto_id: id,
                cantidad: cantidad,
                precio_unitario: producto.precio,
                subtotal: cantidad * producto.precio
            });
        }

        // Calculamos el total de la cesta sumando todos los subtotales de los productos
        const nuevoTotal = await detalles_pedidos.sum('subtotal', {
            where: { pedido_id: pedido.id }
        });
        
        // Guardamos el nuevo importe total en el pedido y nos vamos al carrito
        pedido.total = nuevoTotal;
        await pedido.save();
        res.redirect('/carrito');

    } catch (error) {
        console.error("ERROR AL AÑADIR AL CARRITO:", error);
        res.redirect('/productos');
    }
    
    // Este código de abajo no llega a ejecutarse nunca por los redirects
    if (!carrito) {
        return res.status(404).render('404');
    }
    res.render('/carrito', {
        carrito: carrito
    });
};

// Elimina un producto específico del carrito y actualiza el precio total
const borrarProductoCarrito = async (req, res) => {
    // Aquí el ID que nos llega por parámetro no es el del producto, sino el de la línea (detalle_pedido)
    const { id } = req.params; 

    try {
        // Buscamos la línea del carrito
        const detalle = await detalles_pedidos.findByPk(id);

        if (!detalle) return res.redirect('/carrito');

        // Nos guardamos el id del pedido al que pertenece para poder actualizar el total después
        const pedidoId = detalle.pedido_id;

        // Eliminamos la línea
        await detalle.destroy();

        // Volvemos a consultar todos los productos que quedan en este pedido
        const todosLosDetalles = await detalles_pedidos.findAll({
            where: { pedido_id: pedidoId }
        });

        // Recalculamos el total sumando los subtotales usando un reduce de JavaScript
        const nuevoTotal = todosLosDetalles.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

        // Actualizamos el pedido con su nuevo total
        await pedidos.update({ total: nuevoTotal }, { where: { id: pedidoId } });

        // Volvemos a la vista del carrito actualizado
        res.redirect('/carrito');

    } catch (error) {
        console.error("Error al borrar producto:", error);
        res.redirect('/carrito');
    }
};

// Cambia la cantidad de un producto en el carrito y recalcula totales (usado por AJAX)
const actualizarCantidad = async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;

    try {
        // Buscamos el registro que representa a ese producto dentro del carrito
        const detalle = await detalles_pedidos.findByPk(id, {
            include: [{ model: productos }]
        });

        if (detalle) {
            // Actualizamos el número de unidades y el subtotal de esa fila concreta
            detalle.cantidad = cantidad;
            detalle.subtotal = cantidad * detalle.producto.precio;
            await detalle.save();

            // Como cambió un subtotal, buscamos todo el carrito para recalcular el global
            const todos = await detalles_pedidos.findAll({ where: { pedido_id: detalle.pedido_id } });
            const nuevoTotal = todos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

            // Guardamos el nuevo importe general en la tabla de pedidos
            await pedidos.update({ total: nuevoTotal }, { where: { id: detalle.pedido_id } });

            // Devolvemos un ok a la petición (usado cuando se cambia desde el botón del + y - sin recargar)
            res.json({ ok: true });
        }
    } catch (error) {
        res.status(500).json({ ok: false });
    }
};

// Cierra el pedido pasándolo a "finalizado", genera su factura en PDF y notifica por email
const finalizarCompra = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    try {
        // Traemos el carrito pendiente actual con todos sus productos listos para cobrar
        const pedido = await pedidos.findOne({
            where: { usuario_id: usuarioId, estado: 'pendiente' },
            include: [{ model: detalles_pedidos, as: 'detalles', include: [{ model: productos }] }]
        });

            if (pedido) {
                // Cambiamos su estado a finalizado para que ya conste como comprado
                pedido.estado = 'finalizado';
                await pedido.save();

                // Sacamos los datos del cliente para la factura y el correo
                const usuarioActual = await usuarios.findByPk(usuarioId);

                // Preparamos la ruta y el creador de PDFs
                const rutaPdf = path.join(__dirname, `../public/facturas/Factura-${pedido.id}.pdf`);
                const doc = new PDFDocument({ margin: 50 });
                const stream = fs.createWriteStream(rutaPdf); // Canal para escribir en el archivo local

                // Ligamos el PDF al archivo y usamos el controlador de facturas para dibujar los textos
                doc.pipe(stream);
                dibujarFactura(doc, pedido, usuarioActual.nombre);
                doc.end(); // Cerramos el documento

                // Cuando el PDF termina de crearse y guardarse en el servidor, disparamos el email
                stream.on('finish', async () => {
                    try {
                        await emailCompra({
                            email: usuarioActual.email,
                            nombre: usuarioActual.nombre,
                            idPedido: pedido.id,
                            rutaPdf: rutaPdf
                        });
                    } catch (error) {
                        console.error(" Error en el envío del email:", error);
                    }
                });

                // Llevamos al usuario a la pantalla de éxito
                res.render('gracias', { pagina: 'Compra Realizada' });
            } else {
            res.redirect('/carrito');
        }
    } catch (error) {
        console.log(error);
        res.redirect('/carrito');
    }
};

export {
    agregarCarrito,
    carrito,
    borrarProductoCarrito,
    actualizarCantidad,
    finalizarCompra,
};