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

const paginaEncuentros = async (req, res) => {
    try{
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

const paginaDetallesEncuentros = async (req, res) => {
    const { slug } = req.params;

    try {
        const resultado = await encuentros.findOne({ where: { slug: slug } });

        if (!resultado) {
            return res.status(404).render('404', {
                pagina: 'Página No Encontrada'
            });
        }

        let apuntado = false;
        if (res.locals.usuario && resultado) {
            const reservaExistente = await reservas.findOne({
                where: {
                    usuario_id: res.locals.usuario.id,
                    encuentro_id: resultado.id
                }
            });
            if (reservaExistente) {
                apuntado = true;
            }
        }

        res.render('encuentroQuedada', {
            pagina: 'Información de la quedada',
            encuentro: resultado,
            apuntado
        });

    } catch (error) {
        console.log(error);
    }
};

const guardarReserva = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const { id } = req.params;

    try {
        const encuentro = await encuentros.findByPk(id);

        if (!encuentro) {
            return res.status(404).render('404', {
                pagina: 'Evento no encontrado'
            });
        }

        const nuevaReserva = await reservas.create({
            usuario_id: usuarioId,
            encuentro_id: encuentro.id,
            asistentes: 1
        });

        const usuarioReal = await usuarios.findByPk(usuarioId, { raw: true });
        const rutaPdf = await PDFentrada(usuarioReal, encuentro, nuevaReserva.id);

        await emailReserva({
            email: usuarioReal.email,
            nombre: usuarioReal.nombre,
            idReserva: nuevaReserva.id,
            rutaPdf: rutaPdf
        });

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