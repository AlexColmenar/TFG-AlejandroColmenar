import express from "express";
import {productos} from "../models/productos.js";


import moment from 'moment';
moment.locale('es');

const paginaProductos = async (req, res) => {
    try{
        const producto = await productos.findAll({
        });
        res.render("productos", {
            pagina: "Productos",
            productos: producto,
        });
    }catch(error)
    {
        console.log(error);
    }
};

const paginaDetallesProductos = async (req, res) => {
    const { slug } = req.params;

    try {
        const productoEncontrado = await productos.findOne({ where: { slug: slug } });

        if (!productoEncontrado) {
            return res.status(404).render('404');
        }

        res.render('produs', {
            pagina: 'Información del Producto',
            producto: productoEncontrado
        });

    } catch (error) {
        console.log(error);
    }
};

export {
    paginaProductos,
    paginaDetallesProductos,
};