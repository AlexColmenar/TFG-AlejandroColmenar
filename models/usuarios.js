import {Sequelize} from "sequelize";
import bcrypt from 'bcrypt';
import db from "../BBDD/db.js";


export const usuarios = db.define("usuarios",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre:{
            type: Sequelize.STRING
        },
        email:{
            type: Sequelize.STRING
        },
        password:{
            type: Sequelize.STRING
        },
        rol:{
            type: Sequelize.STRING
        },
        token:{
            type: Sequelize.STRING
        },
        confirmado:{
            type: Sequelize.BOOLEAN
        },
        updatedAt:{
            type: Sequelize.STRING
        },
        createdAt:{
            type: Sequelize.STRING
        }},
    {
        hooks: {
            beforeCreate: async function (usuario) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }

});
