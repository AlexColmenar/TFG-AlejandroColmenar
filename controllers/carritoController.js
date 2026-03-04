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

const carrito = async (req, res) => {
    const usuarioId = res.locals.usuario ? res.locals.usuario.id : null;

    if (!usuarioId) {
        return res.redirect('/login');
    }

    try {
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

        res.render('carrito', {
            pagina: 'Tu Carrito',
            pedido: miPedido
        });

    } catch (error) {
        console.log(error);
        res.render('carrito', { pagina: 'Tu Carrito', pedido: null });
    }
}

const agregarCarrito = async (req, res) => {
    const { id } = req.params;
    let { cantidad } = req.body;
    cantidad = parseInt(cantidad);

    const usuarioId = res.locals.usuario.id;

    try {
        const producto = await productos.findByPk(id);
        if (!producto) return res.redirect('/productos');

        let pedido = await pedidos.findOne({
            where: { usuario_id: usuarioId, estado: 'pendiente' }
        });

        if (!pedido) {
            pedido = await pedidos.create({
                usuario_id: usuarioId,
                fecha: new Date(),
                total: 0,
                estado: 'pendiente'
            });
        }

        const detalleExistente = await detalles_pedidos.findOne({
            where: { pedido_id: pedido.id, producto_id: id }
        });

        if (detalleExistente) {
            detalleExistente.cantidad += cantidad;
            detalleExistente.subtotal = detalleExistente.cantidad * producto.precio;
            await detalleExistente.save();
        } else {
            await detalles_pedidos.create({
                pedido_id: pedido.id,
                producto_id: id,
                cantidad: cantidad,
                precio_unitario: producto.precio,
                subtotal: cantidad * producto.precio
            });
        }

        const nuevoTotal = await detalles_pedidos.sum('subtotal', {
            where: { pedido_id: pedido.id }
        });
        pedido.total = nuevoTotal;
        await pedido.save();
        res.redirect('/carrito');

    } catch (error) {
        console.error("ERROR AL AÑADIR AL CARRITO:", error);
        res.redirect('/productos');
    }
    if (!carrito) {
        return res.status(404).render('404');
    }
    res.render('/carrito', {
        carrito: carrito
    });
};

const borrarProductoCarrito = async (req, res) => {
    const { id } = req.params; // Este es el ID del detalle_pedido

    try {
        const detalle = await detalles_pedidos.findByPk(id);

        if (!detalle) return res.redirect('/carrito');

        const pedidoId = detalle.pedido_id;

        await detalle.destroy();

        const todosLosDetalles = await detalles_pedidos.findAll({
            where: { pedido_id: pedidoId }
        });

        const nuevoTotal = todosLosDetalles.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

        await pedidos.update({ total: nuevoTotal }, { where: { id: pedidoId } });

        res.redirect('/carrito');

    } catch (error) {
        console.error("Error al borrar producto:", error);
        res.redirect('/carrito');
    }
};

const actualizarCantidad = async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;

    try {
        const detalle = await detalles_pedidos.findByPk(id, {
            include: [{ model: productos }]
        });

        if (detalle) {
            detalle.cantidad = cantidad;
            detalle.subtotal = cantidad * detalle.producto.precio;
            await detalle.save();

            const todos = await detalles_pedidos.findAll({ where: { pedido_id: detalle.pedido_id } });
            const nuevoTotal = todos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

            await pedidos.update({ total: nuevoTotal }, { where: { id: detalle.pedido_id } });

            res.json({ ok: true });
        }
    } catch (error) {
        res.status(500).json({ ok: false });
    }
};

const finalizarCompra = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    try {
        const pedido = await pedidos.findOne({
            where: { usuario_id: usuarioId, estado: 'pendiente' },
            include: [{ model: detalles_pedidos, as: 'detalles', include: [{ model: productos }] }]
        });

            if (pedido) {
                pedido.estado = 'finalizado';
                await pedido.save();

                const usuarioActual = await usuarios.findByPk(usuarioId);

                const rutaPdf = path.join(__dirname, `../public/facturas/Factura-${pedido.id}.pdf`);
                const doc = new PDFDocument({ margin: 50 });
                const stream = fs.createWriteStream(rutaPdf);

                doc.pipe(stream);
                dibujarFactura(doc, pedido, usuarioActual.nombre);
                doc.end();

                stream.on('finish', async () => {
                    try {
                        await emailCompra({
                            email: usuarioActual.email, // <--- Ahora sí, email garantizado
                            nombre: usuarioActual.nombre,
                            idPedido: pedido.id,
                            rutaPdf: rutaPdf
                        });
                    } catch (error) {
                        console.error(" Error en el envío del email:", error);
                    }
                });

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
