import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { emailRegistro } from './emailController.js';
import { Usuario, Pedido, Reserva, Encuentro, DetallesPedido, Producto } from '../models/relaciones.js';
import {usuarios} from "../models/usuarios.js";

moment.locale('es');
// Pequeña función para inventar un string aleatorio largo, útil como token de validación de email
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

// Muestra la vista con el formulario para iniciar sesión
const paginaLogin = (req, res) => {
    res.render("login", {
        pagina: "Iniciar Sesión",
    });
};

// Verifica las credenciales del usuario y genera una cookie con un token JWT si son correctas
const autentificacion = async (req, res) => {
    // Recogemos usuario y contraseña crudos desde el form
    const { email, password } = req.body;
    
    // Miramos si existe algún usuario dado de alta con ese email
    const existeUsuario = await Usuario.findOne({ where: { email: email } });
    const errores = [];

    // Si ni siquiera hay fila en la BBDD, detenemos el flujo con un mensaje de alerta
    if (!existeUsuario) {
        return res.render("login", {
            pagina: "Iniciar Sesión",
            errores: [{ mensaje: "El usuario no existe" }]
        });
    }

    // Comprobamos si la persona validó su email. Si está en 0 (false), no le dejamos entrar.
    if (!existeUsuario.confirmado) {
        return res.render("login", {
            pagina: "Iniciar Sesión",
            errores: [{ mensaje: "Tu cuenta no ha sido confirmada aún. Revisa tu email." }],
            usuario: { email: email } // Devolvemos el email para que se quede escrito en el input
        });
    }
    
    // Comparamos el password introducido, cifrándolo para ver si hace 'match' con el encriptado de la BBDD
    const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password);

    if (passwordCorrecto) {
        // Si todo ok, fabricamos un Token JWT que dura 1 día y guarda su ID, Nombre y Permisos
        const token = jwt.sign({ id: existeUsuario.id, nombre: existeUsuario.nombre, rol: existeUsuario.rol }, 'palabrasecreta123', {
            expiresIn: '1d'
        });

        // Guardamos el token dentro del navegador de forma segura (httpOnly impide acceso por javascript malicioso)
        res.cookie('_token', token, {
            httpOnly: true,
        });

        // Una vez con la pulserita de sesión asignada, va directo a inicio
        return res.redirect('/');
    } else {
        // Falló el chequeo de password
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

// Muestra el formulario para crear una nueva cuenta de usuario
const paginaRegistro = (req, res) => {
    res.render("registro", {
        pagina: "Crear Cuenta",
    });
};

// Valida que el email no exista, guarda el nuevo usuario y envía un correo para confirmar su cuenta
const guardarRegistros = async (req, res) => {
    const { nombre, email, password } = req.body;

    // Primer filtro: Si otro usuario ya pilló ese correo, no puede haber dos iguales
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
        // Fabricamos el código aleatorio
        const tokenGenerado = generarId();

        // Almacenamos al usuario. Al estar usando 'bcrypt' antes (o en un hook de sequelize no visible), 
        // asumimos que el password se cifra. El estado 'confirmado' queda a 0.
        await usuarios.create({
            nombre: nombre,
            email: email,
            password: password,
            token: tokenGenerado,
            confirmado: 0
        });

        // Utilizamos el controlador de emails para enviar la invitación de confirmación a su buzón
        await emailRegistro({
            email: email,
            nombre: nombre,
            token: tokenGenerado
        });

        // Refrescamos la vista de login con la franja en verde para darle indicaciones
        return res.render("login", {
            pagina: "Iniciar Sesión",
            alertas: [{ msg: "Cuenta creada correctamente. Revisa tu email para confirmarla." }]
        });

    } catch (error) {
        console.log(error);
    }
};

// Elimina la cookie del token JWT para finalizar la sesión actual del usuario
const cerrarSesion = async (req, res) => {
    // Al forzar el borrado de la galletita del navegador perdemos el JWT y el middleware nos escupirá
    res.clearCookie('_token');
    return res.redirect('/');
}

// Verifica el token recibido por URL y activa la cuenta del usuario en la base de datos
const confirmarCuenta = async (req, res) => {
    // Recogemos el "tokenGenerado" que venía en el enlace de la URL desde su Outlook/Gmail
    const { token } = req.params;

    // Buscamos quién tiene asignado ese chorro de texto aleatorio en la BBDD
    const usuarioConfirmar = await usuarios.findOne({ where: { token: token } });

    // Si nadie lo tiene, o el link es muy viejo / ya usado, pintamos error
    if (!usuarioConfirmar) {
        return res.render("login", {
            pagina: "Error de confirmación",
            errores: [{ mensaje: "Usuario ya confirmado o enlace inválido" }]
        });
    }

    try {
        // Encontramos al usuario. Borramos el token para inutilizar el enlace, y activamos su perfil
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = 1;
        await usuarioConfirmar.save();

        // Lo devolvemos a login pero esta vez con la alerta de que ya puede iniciar sesión
        return res.render("login", {
            pagina: "Cuenta Confirmada",
            alertas: [{ msg: "¡Cuenta confirmada correctamente!" }]
        });

    } catch (error) {
        console.log(error);
    }
}

// Obtiene los pedidos finalizados y las reservas del usuario para mostrarlos en su panel
const mostrarPerfil = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    try {
        // Hacemos una consulta anidada para extraer todos los pedidos completados de este usuario
        // Traemos en cascada: Pedidos -> DetallesPedido -> Producto
        const misPedidos = await Pedido.findAll({
            where: { usuario_id: usuarioId, estado: 'finalizado' },
            include: [
                {
                    model: DetallesPedido,
                    as: 'detalles',
                    include: [{ model: Producto }]
                }
            ],
            order: [['fecha', 'DESC']] // Los mostramos de más recientes a más antiguos
        });

        // Recuperamos a su vez todos los eventos donde se apuntó, trayendo la info del evento
        const misReservas = await Reserva.findAll({
            where: { usuario_id: usuarioId },
            include: [{ model: Encuentro }],
            order: [['id', 'DESC']]
        });

        // Entregamos las dos listas completas a la plantilla "perfil.pug"
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