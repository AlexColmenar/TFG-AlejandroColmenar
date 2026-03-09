import express from "express";
import {experiencias} from "../models/experiencias.js";

import moment from 'moment';
moment.locale('es');

// Obtiene las últimas 9 experiencias desde la base de datos y las muestra en la vista
const paginaExperiencias = async (req, res) => {
    try{
        const experiencia = await experiencias.findAll({
            limit: 9,
            order: [["Id", "DESC"]],
        }); 
        
        // Renderizamos la página de testimonios
        res.render("experiencias", {
            pagina: "Experiencias",
            experiencias: experiencia,
        });
    }catch(error)
    {
        console.log(error);
    }
};

// Valida los datos del formulario, si hay errores los muestra, si no, guarda la nueva experiencia
const guardarExperiencias = async (req, res) => {
    // Rescatamos lo que el usuario ha tecleado en el formulario (por método POST)
    const {nombre, correo, situaciones} = req.body;

    const errores = [];

    // Comprobamos si dejó algún campo vacío quitando los espacios en blanco de los extremos
    if (nombre.trim() === "") {
        errores.push({mensaje: "El nombre está incompleto: "})
    }
    if (correo.trim() === "") {
        errores.push({mensaje: "El correo está incompleto: "})
    }
    if (situaciones.trim() === "") {
        errores.push({mensaje: "El mensaje está incompleto: "})
    }

    // Si detectamos errores de formulario en los if anteriores...
    if (errores.length > 0){
        // Traemos de nuevo algunas experiencias para que la página de recarga no quede vacía
        const Experiencias = await experiencias.findAll({
            limit: 3,
            order: [["Id", "DESC"]],
        });

        // Recargamos la misma vista, pero mostrando las alertas rojas al usuario
        // Mantenemos también los datos que escribió
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
        // Si no hubo errores, guardamos el mensaje en la BBDD
        try {
            // El create() mapea las columnas de la tabla con las variables de la petición
            await experiencias.create({nombre: nombre, correo: correo, situaciones: situaciones,});
            
            // Refrescamos la vista principal para que se vea su experiencia recién añadida
            res.redirect('/experiencias'); 
        } catch (error) {
            console.log(error);
        }
    }
};

export {
    paginaExperiencias,
    guardarExperiencias,
};
