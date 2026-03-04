import jwt from 'jsonwebtoken';
import { usuarios } from '../models/usuarios.js';

const protegerRuta = async (req, res, next) => {
    const { _token } = req.cookies;

    if (!_token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(_token, 'palabrasecreta123');
        const usuario = await usuarios.findByPk(decoded.id);
        if (usuario) {
            req.usuario = usuario;
            return next();
        } else {
            return res.clearCookie('_token').redirect('/login');
        }

    } catch (error) {
        return res.clearCookie('_token').redirect('/login');
    }
}

export default protegerRuta;