import express from "express";
import {experiencias} from "../models/experiencias.js";

import moment from 'moment';
moment.locale('es');


const paginaExperiencias = async (req, res) => {
    try{
        const experiencia = await experiencias.findAll({
            limit: 9,
            order: [["Id", "DESC"]],


        }); //busca todas las experiencias en BBDD
        res.render("experiencias", {
            pagina: "Experiencias",
            experiencias: experiencia,
        });
    }catch(error)
    {
        console.log(error);
    }
};

//siempre que quiera consultar a la BBDD hay qie poner await y async que son las promesas y el trycatch para comprobar
const guardarExperiencias = async (req, res) => {

    const {nombre, correo, situaciones} = req.body;

    const errores = [];

    if (nombre.trim() === "") {
        errores.push({mensaje: "El nombre está incompleto: "})
    }
    if (correo.trim() === "") {
        errores.push({mensaje: "El correo está incompleto: "})
    }
    if (situaciones.trim() === "") {
        errores.push({mensaje: "El mensaje está incompleto: "})
    }

    if (errores.length > 0){

        const Experiencias = await experiencias.findAll({
            limit: 3,
            order: [["Id", "DESC"]],
        });

        res.render('experiencias', {
            pagina: 'Experiencias',
            errores: errores,
            nombre: nombre,
            correo: correo,
            situaciones: situaciones,
            experiencias: Experiencias,
        });
    }else
    {
        //Almacenar el mensaje en la BBDD
        try {
            //await hace que si no esta la fila la crea
            await experiencias.create({nombre: nombre, correo: correo, situaciones: situaciones,});
            res.redirect('/experiencias'); //Guardo en la base de datos y lo envío a la misma vista
        } catch (error) {
            console.log(error);
        }
    }
};

export {
    paginaExperiencias,
    guardarExperiencias,
};

