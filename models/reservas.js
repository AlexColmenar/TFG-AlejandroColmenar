import {Sequelize} from "sequelize";
import db from "../BBDD/db.js";

export const reservas = db.define("reservas",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        asistentes:{
            type: Sequelize.INTEGER
        },
        pdf_token:{
            type: Sequelize.STRING
        },
        fecha_reserva:{
            type: Sequelize.DATE
        }

    },
    {
        //para que no busque las columnas createdAt y updatedAt
        timestamps: false
    });