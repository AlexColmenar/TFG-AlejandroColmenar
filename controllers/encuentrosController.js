import express from "express";
import {encuentros} from "../models/encuentros.js";
import { PDFentrada } from './facturaEncuentroController.js';
import { emailReserva } from './emailController.js';
import { reservas } from '../models/reservas.js';
import moment from 'moment';
import { usuarios } from '../models/usuarios.js';
moment.locale('es');

const paginaEncuentros = async (req, res) => {
    try{
        const encuentro = await encuentros.findAll({
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

    const encuentro = await Encuentros.findOne({ where: { slug: req.params.slug } });
    if (!encuentro) {
        return res.status(404).render('404');
    }
    res.render('/', {
        encuentro: encuentro
    });
};

const guardarReserva = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const { id } = req.params;

    try {
        const encuentro = await encuentros.findByPk(id);
        if (!encuentro) return res.redirect('/encuentros');

        const nuevaReserva = await reservas.create({
            usuario_id: usuarioId,
            encuentro_id: encuentro.id,
            asistentes: 1
        });

        const usuarioReal = await usuarios.findByPk(usuarioId, { raw: true });

        console.log("DEBUG - Email recuperado de la DB:", usuarioReal.email);

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

        res.render('graciasEncuentro', {
            pagina: '¡Inscripción Confirmada!'
        });

    } catch (error) {
        console.log("Error al guardar la reserva: ", error);
    }
    const encuentro = await Encuentros.findOne({ where: { slug: req.params.slug } });
    if (!encuentro) {
        return res.status(404).render('404');
    }
    res.render('/', {
        encuentro: encuentro
    });
}


export {
    paginaEncuentros,
    paginaDetallesEncuentros,
    guardarReserva
};