import { usuarios } from '../models/usuarios.js';
import { pedidos } from '../models/pedidos.js';
import { detalles_pedidos } from '../models/detalles_pedidos.js';
import { productos } from '../models/productos.js';
import { encuentros } from '../models/encuentros.js';
import {reservas} from "../models/reservas.js";

const panelPrincipal = async (req, res) => {
    try {
        const usuario = await usuarios.findAll({
            attributes: { exclude: ['password', 'token', 'confirmado'] }
        });

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
        const reserva = await reservas.findAll({ // Cambiamos a reservas
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

        const listaProductos = await productos.findAll();
        const listaEncuentros = await encuentros.findAll();

        res.render('administrador', {
            pagina: 'Panel de Administración',
            usuarios: usuario,
            pedidos : pedido,
            productos: listaProductos,
            encuentros: listaEncuentros,
            reservas: reserva
        });

    } catch (error) {
        console.log(error);
        res.redirect('/administrador');
    }
};

const crearProducto = async (req, res) => {
    try {
        console.log("Archivo subido:", req.file);
        console.log("Datos de texto:", req.body);

        await productos.create({
            nombre: req.body.Nombre,
            precio: req.body.Precio,
            descripcion: req.body.Descripcion,
            stock: req.body.Stock,
            imagen: req.file.filename,
            slug: req.body.Nombre.toLowerCase().replace(/\s+/g, '-') //Slug automático
        });
        res.redirect('/administrador')
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

const crearEncuentro = async (req, res) => {
    try {
        console.log("Archivo subido:", req.file);
        console.log("Datos de texto:", req.body);

        await encuentros.create({
            ciudad: req.body.Ciudad,
            espacio: req.body.Espacio,
            tiempo: req.body.Tiempo,
            actividades: req.body.Actividades,
            latitud: req.body.Latitud,
            longitud: req.body.Longitud,
            imagen: req.file.filename,
            slug: req.body.Ciudad.toLowerCase().replace(/\s+/g, '-') //Slug automático
        });
        res.redirect('/administrador')
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

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
    if (!admin) {
        return res.status(404).render('404');
    }
    res.render('/administrador', {
        admin: admin
    });
};

const eliminarEncuentro = async (req, res) => {
    try {
        const { id } = req.params;

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
    if (!admin) {
        return res.status(404).render('404');
    }
    res.render('/administrador', {
        admin: admin
    });
};

const editarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        console.log("Archivo subido:", req.file);
        console.log("Datos de texto:", req.body);

        const datosActualizados = {
            nombre: req.body.Nombre,
            precio: req.body.Precio,
            descripcion: req.body.Descripcion,
            stock: req.body.Stock,
            slug: req.body.Nombre.toLowerCase().replace(/\s+/g, '-')
        };

        if (req.file) {
            datosActualizados.imagen = req.file.filename;
        }

        await productos.update(datosActualizados, {
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


const editarEncuentro = async (req, res) => {
    const { id } = req.params;

    try {
        console.log("Archivo subido:", req.file);
        console.log("Datos de texto:", req.body);

        const datosActualizados = {
            ciudad: req.body.Ciudad,
            espacio: req.body.Espacio,
            tiempo: req.body.Tiempo,
            actividades: req.body.Actividades,
            slug: (req.body.Ciudad || "").toLowerCase().replace(/\s+/g, '-')};
        if (req.file) {
            datosActualizados.imagen = req.file.filename;
        }

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

const vistaEditarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await productos.findByPk(id);
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

const vistaEditarEncuentro = async (req, res) => {
    const { id } = req.params;

    try {
        const encuentro = await encuentros.findByPk(id);
        //para formatear la fecha y aparezca la correcta
        const fechaFormateada = encuentro.tiempo.toISOString().slice(0, 16);
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