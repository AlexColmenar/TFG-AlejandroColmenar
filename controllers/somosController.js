import express from "express";
import moment from 'moment';
moment.locale('es');

const quienesSomos = (req, res) => {
    res.render( "nosotros",{
        pagina: "Quienes somos",
    });
};

export {
    quienesSomos
};