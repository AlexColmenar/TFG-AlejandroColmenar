import jwt from 'jsonwebtoken';
import { usuarios } from '../models/usuarios.js';

// Middleware que verifica si un usuario tiene una sesión iniciada válida antes de permitirle acceder a ciertas rutas
const protegerRuta = async (req, res, next) => {
    // Extrae el token de las cookies del navegador
    const { _token } = req.cookies;

    // Si no hay token, el usuario no está autenticado y se le redirige al login
    if (!_token) {
        return res.redirect('/login');
    }

    try {
        // Desencripta el token usando la palabra secreta para obtener los datos del usuario (como su ID)
        const decoded = jwt.verify(_token, 'palabrasecreta123');
        
        // Busca al usuario en la base de datos usando el ID extraído del token
        const usuario = await usuarios.findByPk(decoded.id);
        
        // Si el usuario existe, lo guarda en la petición (req) y permite que el proceso continúe (next)
        if (usuario) {
            req.usuario = usuario;
            return next();
        } else {
            // Si el token es de un usuario que ya no existe, borra la cookie y redirige al login
            return res.clearCookie('_token').redirect('/login');
        }

    } catch (error) {
        // Si el token no es válido o ha expirado, borra la cookie de seguridad y redirige al login
        return res.clearCookie('_token').redirect('/login');
    }
}

export default protegerRuta;