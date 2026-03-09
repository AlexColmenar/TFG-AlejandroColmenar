import express from "express";
import {encuentros} from "../models/encuentros.js";
import { PDFentrada } from './facturaEncuentroController.js';
import { emailReserva } from './emailController.js';
import { reservas } from '../models/reservas.js';
import moment from 'moment';
import { usuarios } from '../models/usuarios.js';
import {productos} from "../models/productos.js";
import {experiencias} from "../models/experiencias.js";
moment.locale('es');

// Obtiene todos los encuentros disponibles de la base de datos ordenados por fecha y los renderiza en la vista
const paginaEncuentros = async (req, res) => {
    try{
        // Consultamos la tabla encuentros ordenando de los más cercanos en el tiempo a los más lejanos
        const encuentro = await encuentros.findAll({
        order: [["Tiempo", "ASC"]]
        });
        res.render("encuentros", {
            pagina: "Encuentros",
            encuentros: encuentro,
            moment: moment,
        });
    }catch(error)
    {
        console.log(error);
    }
};

// Muestra los detalles de un encuentro específico e indica si el usuario ya está apuntado
const paginaDetallesEncuentros = async (req, res) => {
    // Tomamos el 'slug' (URL amigable) desde la barra de direcciones
    const { slug } = req.params;

    try {
        // Buscamos cuál es el encuentro que coincide con esta URL
        const resultado = await encuentros.findOne({ where: { slug: slug } });

        if (!resultado) {
            return res.status(404).render('404', {
                pagina: 'Página No Encontrada'
            });
        }

        // Bandera para saber si el botón dirá "Apuntarse" o "Ya estás apuntado"
        let apuntado = false;
        
        // Comprobamos si hay alguien conectado (usuario en res.locals) y si es así, miramos en reservas
        if (res.locals.usuario && resultado) {
            const reservaExistente = await reservas.findOne({
                where: {
                    usuario_id: res.locals.usuario.id,
                    encuentro_id: resultado.id
                }
            });
            
            // Si devuelve algo, significa que este usuario ya se registró para ir a este evento
            if (reservaExistente) {
                apuntado = true;
            }
        }

        // Construimos la vista de la quedada
        res.render('encuentroQuedada', {
            pagina: 'Información de la quedada',
            encuentro: resultado,
            apuntado // Pasamos la variable booleana para la lógica del botón en el PUG
        });

    } catch (error) {
        console.log(error);
    }
};

// Genera una nueva reserva para el usuario, envía el PDF por correo y aumenta el número de plazas ocupadas
const guardarReserva = async (req, res) => {
    // Tomamos los IDs del participante y del encuentro objetivo
    const usuarioId = res.locals.usuario.id;
    const { id } = req.params;

    try {
        // Validamos que el encuentro siga activo en la base de datos
        const encuentro = await encuentros.findByPk(id);

        if (!encuentro) {
            return res.status(404).render('404', {
                pagina: 'Evento no encontrado'
            });
        }

        // Insertamos el registro en la tabla pivote de 'reservas'
        const nuevaReserva = await reservas.create({
            usuario_id: usuarioId,
            encuentro_id: encuentro.id,
            asistentes: 1
        });

        // Recuperamos la info cruda del usuario para poder enviarle el mail de su entrada
        const usuarioReal = await usuarios.findByPk(usuarioId, { raw: true });
        
        // Generamos el ticket físico en PDF e indicamos dónde se ha guardado en el servidor
        const rutaPdf = await PDFentrada(usuarioReal, encuentro, nuevaReserva.id);

        // Mandamos un correo con los datos y el ticket adjunto
        await emailReserva({
            email: usuarioReal.email,
            nombre: usuarioReal.nombre,
            idReserva: nuevaReserva.id,
            rutaPdf: rutaPdf
        });

        // Actualizamos en la tabla del encuentro el contador total de plazas ocupadas
        await encuentros.increment('plazas_ocupadas', {
            by: 1,
            where: { id: encuentro.id }
        });

        return res.render('graciasEncuentro', {
            pagina: 'Inscripción Confirmada',
            idReserva: nuevaReserva.id
        });

    } catch (error) {
        console.log("Error al guardar la reserva: ", error);
        res.redirect('/encuentros');
    }
}

export {
    paginaEncuentros,
    paginaDetallesEncuentros,
    guardarReserva
};