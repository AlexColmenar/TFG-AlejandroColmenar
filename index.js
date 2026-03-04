//importar el modulo para crear aplicaciones web
import 'dotenv/config';
import express from "express";
import index from "./routers/index.js";
import db from "./BBDD/db.js";
import moment from 'moment';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import "./models/relaciones.js";
moment.locale('es');


//Esta la instancia de las aplicaciones exress
const app = express();


//Definimos el puerto por defecto
const port = process.env.PORT || 13004;

//Midleware es app
//Habilitar PUG
app.set("view engine", "pug");

//Definir la carpeta pública
app.use(express.static('public'));

//añadimos moment para todos los archivos pug
app.locals.moment = moment;

// Añadido para leer los datos del formulario POST (req.body)
app.use(express.urlencoded({extended: true}));

app.use(express.json());

//API para que la cookie lea el inicio de sesion y lo mantenga
app.use(cookieParser());
app.use(async (req, res, next) => {
    const token = req.cookies._token;
    if (token) {
        try {
            const decoded = jwt.verify(token, 'palabrasecreta123');
            res.locals.usuario = decoded;
        } catch (error) {
            res.locals.usuario = null;
        }
    } else {
        res.locals.usuario = null;
    }
    next();
});

//Agregar index
app.use("/", index);

//Para escuchar del puerto y ver que funciona
app.listen(port, () => {
    console.log(`Servidor conectado en el puerto ${port}`);
});

// Middleware para atrapar el error 404
app.use((req, res) => {
    res.status(404).render('404', {
        pagina: 'Página no encontrada'
    });
});