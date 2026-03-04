import res from "express/lib/response.js";

const admin = (req, res, next) => {
    if (res.locals.usuario && res.locals.usuario.rol === "administrador") {
        return next();
    } else if (res.locals.usuario){
        res.redirect('/404');
    }
    res.redirect('/404');
}

export default admin;