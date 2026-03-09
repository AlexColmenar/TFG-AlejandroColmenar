import express from "express";
import {productos} from "../models/productos.js";

import moment from 'moment';
moment.locale('es');

// Recupera todos los productos de la base de datos y los envía a la vista principal de la tienda
const paginaProductos = async (req, res) => {
    try{
        // Hacemos el SELECT entero de la tabla productos y los organizamos por precio ascendente (de barato a caro)
        const producto = await productos.findAll({
            order: [["Precio", "ASC"]]
        });
        
        // Mostramos el diseño y le mandamos el array lleno con lo recolectado
        res.render("productos", {
            pagina: "Productos",
            productos: producto,
        });
    }catch(error)
    {
        console.log(error);
    }
};

// Busca un producto específico por su 'slug' y muestra sus detalles en una vista individual
const paginaDetallesProductos = async (req, res) => {
    // Tomamos el string legible (por ej: 'pelota-sensorial') de la dirección web
    const { slug } = req.params;

    try {
        // En lugar de buscar por id (findByPk), usamos where y limit 1 (findOne) basado en el texto del slug
        const productoEncontrado = await productos.findOne({ where: { slug: slug } });

        // Si la base de datos devuelve null (es un slug inventado), saltamos al 404
        if (!productoEncontrado) {
            return res.status(404).render('404');
        }

        // Si existe, preparamos la vista extendida del producto
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