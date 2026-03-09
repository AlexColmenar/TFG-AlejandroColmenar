import res from "express/lib/response.js";

//si es usuario y tiene el rol de administrador puede pasar sino salta el error 404
const admin = (req, res, next) => {
    if (res.locals.usuario && res.locals.usuario.rol === "administrador") {
        return next();
    } else if (res.locals.usuario){
        res.redirect('/404');
    }
    res.redirect('/404');
}

export default admin;