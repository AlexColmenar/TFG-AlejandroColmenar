import {Sequelize} from "sequelize";
import db from "../BBDD/db.js";

export const detalles_pedidos = db.define("detalles_pedidos", {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad:{
            type: Sequelize.INTEGER
        },
        precio_unitario:{
            type: Sequelize.DECIMAL
        },
        subtotal: {
            type: Sequelize.DECIMAL(10, 2)
        }
    },
    {
        //para que no busque las columnas createdAt y updatedAt
        timestamps: false
    });