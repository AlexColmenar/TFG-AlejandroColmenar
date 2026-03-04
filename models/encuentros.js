import {Sequelize} from "sequelize";
import db from "../BBDD/db.js";

export const encuentros = db.define("encuentros",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ciudad:{
            type: Sequelize.STRING
        },
        espacio:{
            type: Sequelize.STRING
        },
        tiempo:{
            type: Sequelize.DATE
        },
        actividades:{
            type: Sequelize.FLOAT
        },
        latitud: {
            type: Sequelize.FLOAT
        },
        longitud: {
            type: Sequelize.STRING
        },
        imagen:{
            type: Sequelize.STRING
        },
        slug:{
            type: Sequelize.STRING
        },

    },
    {
        //para que no busque las columnas createdAt y updatedAt
        timestamps: false
    });