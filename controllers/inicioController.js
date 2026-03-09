import express from "express";
import {encuentros} from "../models/encuentros.js";
import {experiencias} from "../models/experiencias.js";
import {productos} from "../models/productos.js";
import moment from 'moment';
moment.locale('es');

// Obtiene los 3 primeros encuentros, productos y experiencias para mostrarlos en la página de inicio
const paginaInicio = async (rec, res) => {

    // Creamos un array de promesas. Queremos hacer 3 consultas distintas a la BBDD a la vez para no perder tiempo
    const promiseDB=[ ];
    
    // Pedimos los primeros 3 encuentros
    promiseDB.push(encuentros.findAll({limit:3, order: [["Id", "ASC"]]}));
    
    // Pedimos los 3 últimos productos que han entrado al catálogo (ordenados por nombre o ID)
    promiseDB.push(productos.findAll({limit:3, order: [["Nombre", "DESC"]]}));
    
    // Pedimos 3 experiencias para el carrusel de opiniones
    promiseDB.push(experiencias.findAll({
        limit: 3,
        order: [["Id", "ASC"]],
    }));

    try{
        // Promise.all espera a que terminen las 3 llamadas simultáneas y nos devuelve los resultados en un array
        const resultado = await Promise.all(promiseDB);
        
        // Pasamos esos tres bloques de datos al motor de plantillas (Pug)
        res.render("inicio", {
            pagina: "Inicio",
            clase: "home",
            experiencias: resultado[2], // La posición 2 es lo tercero que pedimos
            encuentros: resultado[0],   // La posición 0 es la primera
            productos: resultado [1],   // La posición 1 es la segunda
        });

    }catch(error){
        console.log(error);
    }
}

export {
    paginaInicio,
};