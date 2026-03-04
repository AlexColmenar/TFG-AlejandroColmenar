import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { emailRegistro } from './emailController.js';
import { Usuario, Pedido, Reserva, Encuentro, DetallesPedido, Producto } from '../models/relaciones.js';
import {usuarios} from "../models/usuarios.js";

moment.locale('es');
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

const paginaLogin = (req, res) => {
    res.render("login", {
        pagina: "Iniciar Sesión",
    });
};

const autentificacion = async (req, res) => {
    const { email, password } = req.body;
    const existeUsuario = await Usuario.findOne({ where: { email: email } });
    const errores = [];

    if (!existeUsuario) {
        return res.render("login", {
            pagina: "Iniciar Sesión",
            errores: [{ mensaje: "El usuario no existe" }]
        });
    }

    if (!existeUsuario.confirmado) {
        return res.render("login", {
            pagina: "Iniciar Sesión",
            errores: [{ mensaje: "Tu cuenta no ha sido confirmada aún. Revisa tu email." }],
            usuario: { email: email }
        });
    }
    const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password);

    if (passwordCorrecto) {
        const token = jwt.sign({ id: existeUsuario.id, nombre: existeUsuario.nombre, rol: existeUsuario.rol }, 'palabrasecreta123', {
            expiresIn: '1d'
        });

        res.cookie('_token', token, {
            httpOnly: true,
        });

        return res.redirect('/');
    } else {
        errores.push({ mensaje: "La contraseña es incorrecta" });
        return res.render("login", {
            pagina: "Iniciar Sesión",
            errores,
            usuario: {
                email: email,
            }
        });
    }
};

const paginaRegistro = (req, res) => {
    res.render("registro", {
        pagina: "Crear Cuenta",
    });
};

const guardarRegistros = async (req, res) => {
    const { nombre, email, password } = req.body;

    const existeUsuario = await usuarios.findOne({ where: { email: email } });

    if (existeUsuario) {
        return res.render("registro", {
            pagina: "Crear Cuenta",
            errores: [{ mensaje: "El usuario ya está registrado" }],
            usuario: {
                nombre: nombre,
                email: email
            }
        });
    }

    try {
        const tokenGenerado = generarId();

        await usuarios.create({
            nombre: nombre,
            email: email,
            password: password,
            token: tokenGenerado,
            confirmado: 0
        });

        await emailRegistro({
            email: email,
            nombre: nombre,
            token: tokenGenerado
        });

        return res.render("login", {
            pagina: "Iniciar Sesión",
            alertas: [{ msg: "Cuenta creada correctamente. Revisa tu email para confirmarla." }]
        });

    } catch (error) {
        console.log(error);
    }
};

const cerrarSesion = async (req, res) => {
    res.clearCookie('_token');
    return res.redirect('/');
}

const confirmarCuenta = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await usuarios.findOne({ where: { token: token } });

    if (!usuarioConfirmar) {
        return res.render("login", {
            pagina: "Error de confirmación",
            errores: [{ mensaje: "Usuario ya confirmado" }]
        });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = 1;
        await usuarioConfirmar.save();

        return res.render("login", {
            pagina: "Cuenta Confirmada",
            alertas: [{ msg: "¡Cuenta confirmada correctamente!" }]
        });

    } catch (error) {
        console.log(error);
    }
}


const mostrarPerfil = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    try {
        const misPedidos = await Pedido.findAll({
            where: { usuario_id: usuarioId, estado: 'finalizado' },
            include: [
                {
                    model: DetallesPedido,
                    as: 'detalles',
                    include: [{ model: Producto }]
                }
            ],
            order: [['fecha', 'DESC']]
        });

        const misReservas = await Reserva.findAll({
            where: { usuario_id: usuarioId },
            include: [{ model: Encuentro }],
            order: [['id', 'DESC']]
        });

        res.render('perfil', {
            pagina: 'Mi Perfil',
            pedidos: misPedidos,
            encuentros: misReservas
        });

    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        res.redirect('/');
    }
}

export {
    paginaLogin,
    paginaRegistro,
    guardarRegistros,
    autentificacion,
    cerrarSesion,
    confirmarCuenta,
    mostrarPerfil,
};