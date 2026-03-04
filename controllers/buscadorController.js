import db from '../BBDD/db.js';

export const realizarBusqueda = async (req, res) => {
    const textoBuscado = req.query.termino;

    if (!textoBuscado) {
        return res.render('fijo/buscador', {
            termino: '',
            productos: [],
            encuentros: []
        });
    }

    try {
        const busquedaSQL = `%${textoBuscado}%`;

        const queryProductos = `
            SELECT * FROM productos
            WHERE nombre LIKE ? OR descripcion LIKE ?
        `;

        const queryEncuentros = `
            SELECT * FROM encuentros
            WHERE actividades LIKE ? OR ciudad LIKE ?
        `;

        const [resultadosProductos, resultadosEncuentros] = await Promise.all([
            db.query(queryProductos, { replacements: [busquedaSQL, busquedaSQL] }),
            db.query(queryEncuentros, { replacements: [busquedaSQL, busquedaSQL] })
        ]);

        res.render('fijo/buscador', {
            termino: textoBuscado,
            productos: resultadosProductos[0],
            encuentros: resultadosEncuentros[0]
        });

    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).send("Error interno al realizar la búsqueda");
    }
};

