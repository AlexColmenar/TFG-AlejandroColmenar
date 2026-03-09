import { usuarios } from '../models/usuarios.js';
import { pedidos } from '../models/pedidos.js';
import { detalles_pedidos } from '../models/detalles_pedidos.js';
import { productos } from '../models/productos.js';
import { encuentros } from '../models/encuentros.js';
import {reservas} from "../models/reservas.js";

// Carga los datos de usuarios, pedidos, reservas, productos y encuentros para mostrarlos en el panel
const panelPrincipal = async (req, res) => {
    try {
        // Obtenemos todos los usuarios excluyendo contraseñas y tokens por seguridad
        const usuario = await usuarios.findAll({
            attributes: { exclude: ['password', 'token', 'confirmado'] }
        });

        // Traemos todos los pedidos que ya estén pagados (finalizados)
        // Incluimos los detalles de los productos y los datos del usuario que compró
        const pedido = await pedidos.findAll({
            where: { estado: 'finalizado' },
            include: [
                {
                    model: detalles_pedidos,
                    as: 'detalles',
                    include: [{
                        model: productos,
                        as: 'producto'
                    }]
                },
                {
                    model: usuarios,
                    as: 'usuario',
                    attributes: ['nombre', 'email']
                }
            ],
            order: [['fecha', 'DESC']]
        });
        
        // Consultamos las reservas de los encuentros vinculando los datos de usuario y encuentro
        const reserva = await reservas.findAll({
            include: [
                {
                    model: usuarios,
                    attributes: ['nombre', 'email']
                },
                {
                    model: encuentros,
                }
            ],
            order: [['id', 'DESC']]
        });

        // Recogemos todo el catálogo de productos y todos los encuentros disponibles
        const listaProductos = await productos.findAll();
        const listaEncuentros = await encuentros.findAll();

        // Mandamos todas estas variables a la vista de administración para pintarlas en las tablas
        res.render('administrador', {
            pagina: 'Panel de Administración',
            usuarios: usuario,
            pedidos : pedido,
            productos: listaProductos,
            encuentros: listaEncuentros,
            reservas: reserva
        });

    } catch (error) {
        // En caso de error de BBDD, mostramos por consola y recargamos la página
        console.log(error);
        res.redirect('/administrador');
    }
};

// Recibe datos del formulario y la imagen subida para crear un nuevo producto
const crearProducto = async (req, res) => {
    try {
        console.log("Archivo subido:", req.file);
        console.log("Datos de texto:", req.body);

        // Guardamos el nuevo registro en la base de datos
        await productos.create({
            nombre: req.body.Nombre,
            precio: req.body.Precio,
            descripcion: req.body.Descripcion,
            stock: req.body.Stock,
            imagen: req.file.filename, // Guardamos solo el nombre del archivo generado por multer
            slug: req.body.Nombre.toLowerCase().replace(/\s+/g, '-') // Generamos la URL amigable
        });
        
        // Volvemos al panel principal para que se vea el nuevo producto en la tabla
        res.redirect('/administrador')
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// Guarda un nuevo encuentro con los datos recibidos, incluyendo ubicación y foto
const crearEncuentro = async (req, res) => {
    try {
        console.log("Archivo subido:", req.file);
        console.log("Datos de texto:", req.body);

        // Insertamos el encuentro en base de datos recogiendo los campos del formulario
        await encuentros.create({
            ciudad: req.body.Ciudad,
            espacio: req.body.Espacio,
            tiempo: req.body.Tiempo,
            actividades: req.body.Actividades,
            latitud: req.body.Latitud,
            longitud: req.body.Longitud,
            imagen: req.file.filename, // Guardamos el archivo subido
            slug: req.body.Ciudad.toLowerCase().replace(/\s+/g, '-') // Generamos la URL amigable
        });
        res.redirect('/administrador')
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// Elimina un producto específico por su ID
const eliminarProducto = async (req, res) => {
    try {
        // Recogemos el ID del producto desde los parámetros de la URL
        const { id } = req.params;

        // Borramos el producto de la base de datos
        await productos.destroy({
            where: {
                id: id
            }
        });
        res.redirect('/administrador');

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al eliminar');
    }
    // NOTA: Esta parte de código es inalcanzable tras los res.redirect y throw, pero se mantiene intacta la lógica
    if (!admin) {
        return res.status(404).render('404');
    }
    res.render('/administrador', {
        admin: admin
    });
};

// Elimina un encuentro específico mediante su ID
const eliminarEncuentro = async (req, res) => {
    try {
        // Capturamos el ID del encuentro desde la URL
        const { id } = req.params;

        // Ejecutamos el borrado
        await encuentros.destroy({
            where: {
                id: id
            }
        });
        res.redirect('/administrador');

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al eliminar');
    }
    // NOTA: Similar al anterior, código inalcanzable tras res.redirect
    if (!admin) {
        return res.status(404).render('404');
    }
    res.render('/administrador', {
        admin: admin
    });
};

// Actualiza la información y/o imagen de un producto existente
const editarProducto = async (req, res) => {
    // Obtenemos qué producto modificar mediante su ID en la URL
    const { id } = req.params;

    try {
        console.log("Archivo subido:", req.file);
        console.log("Datos de texto:", req.body);

        // Preparamos los nuevos datos de texto
        const datosActualizados = {
            nombre: req.body.Nombre,
            precio: req.body.Precio,
            descripcion: req.body.Descripcion,
            stock: req.body.Stock,
            slug: req.body.Nombre.toLowerCase().replace(/\s+/g, '-')
        };

        // Si el admin subió una imagen nueva, la agregamos al objeto de actualización
        if (req.file) {
            datosActualizados.imagen = req.file.filename;
        }

        // Sobrescribimos el registro en BBDD con los datos procesados
        await productos.update(datosActualizados, {
            where: { id: id }
        });

        // Recargamos el panel de administración
        res.redirect('/administrador');

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
    
    if (!admin) {
        return res.status(404).render('404');
    }
    res.render('/administrador', {
        admin: admin
    });
};

// Actualiza los datos y/o la imagen de un encuentro existente
const editarEncuentro = async (req, res) => {
    // Extraemos el ID
    const { id } = req.params;

    try {
        console.log("Archivo subido:", req.file);
        console.log("Datos de texto:", req.body);

        // Preparamos los textos actualizados
        const datosActualizados = {
            ciudad: req.body.Ciudad,
            espacio: req.body.Espacio,
            tiempo: req.body.Tiempo,
            actividades: req.body.Actividades,
            slug: (req.body.Ciudad || "").toLowerCase().replace(/\s+/g, '-')};
            
        // Si hay una foto nueva, la incluimos
        if (req.file) {
            datosActualizados.imagen = req.file.filename;
        }

        // Hacemos el UPDATE en la tabla
        await encuentros.update(datosActualizados, {
            where: { id: id }
        });

        res.redirect('/administrador');

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
    
    if (!admin) {
        return res.status(404).render('404');
    }
    res.render('/administrador', {
        admin: admin
    });
};

// Muestra el formulario prellenado para editar un producto
const vistaEditarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        // Buscamos el producto solicitado para rellenar los inputs
        const producto = await productos.findByPk(id);
        
        // Renderizamos la vista de edición pasándole el producto
        res.render('fijo/editarProducto', {
            producto
        });

    } catch (error) {
        console.log(error);
        res.redirect('/administrador');
    }
    if (!admin) {
        return res.status(404).render('404');
    }
    res.render('/administrador', {
        admin: admin
    });
};

// Muestra el formulario con la información actual de un encuentro para modificarlo
const vistaEditarEncuentro = async (req, res) => {
    const { id } = req.params;

    try {
        // Consultamos el encuentro en cuestión
        const encuentro = await encuentros.findByPk(id);
        
        // Formateamos la fecha para que el input type="datetime-local" pueda leerla correctamente
        const fechaFormateada = encuentro.tiempo.toISOString().slice(0, 16);
        
        // Renderizamos la vista inyectando la fecha ajustada
        res.render('fijo/editarEncuentro', {
            encuentro,
            fechaFormateada
        });

    } catch (error) {
        console.log(error);
        res.redirect('/administrador');
    }
    if (!admin) {
        return res.status(404).render('404');
    }
    res.render('/administrador', {
        admin: admin
    });
};

export {
    panelPrincipal,
    crearProducto,
    crearEncuentro,
    eliminarProducto,
    eliminarEncuentro,
    editarProducto,
    editarEncuentro,
    vistaEditarProducto,
    vistaEditarEncuentro
};