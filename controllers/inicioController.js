import express from "express";
import {encuentros} from "../models/encuentros.js";
import {experiencias} from "../models/experiencias.js";
import {productos} from "../models/productos.js";
import moment from 'moment';
moment.locale('es');

const paginaInicio = async (rec, res) => {

    const promiseDB=[ ];
    promiseDB.push(encuentros.findAll({limit:3, order: [["Id", "ASC"]]}));
    promiseDB.push(productos.findAll({limit:3, order: [["Nombre", "DESC"]]}));
    promiseDB.push(experiencias.findAll({
        limit: 3,
        order: [["Id", "ASC"]],
    }));

    //Consultar 3 viajes del modelo Viajes
    try{
        const resultado = await Promise.all(promiseDB);
        res.render("inicio", {
            pagina: "Inicio",
            clase: "home",
            experiencias: resultado[2],
            encuentros: resultado[0],
            productos: resultado [1],
        });

    }catch(error){
        console.log(error);
    }
}

export {
    paginaInicio,
};