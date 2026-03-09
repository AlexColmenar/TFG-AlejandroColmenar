import db from '../BBDD/db.js';

// Busca términos concurrentemente en los nombres/descripciones de productos y actividades/ciudades de encuentros
export const realizarBusqueda = async (req, res) => {
    const textoBuscado = req.query.termino;

    // Si el usuario da enter con el buscador vacío, devolvemos la vista en blanco
    if (!textoBuscado) {
        return res.render('fijo/buscador', {
            termino: '',
            productos: [],
            encuentros: []
        });
    }

    try {
        // Preparamos el formato para buscar coincidencias parciales con LIKE (%palabra%)
        const busquedaSQL = `%${textoBuscado}%`;

        // Preparamos la consulta para la tabla de productos (nombre o descripción)
        const queryProductos = `
            SELECT * FROM productos
            WHERE nombre LIKE ? OR descripcion LIKE ?
        `;

        // Preparamos la consulta para la tabla de encuentros (actividades o ciudad)
        const queryEncuentros = `
            SELECT * FROM encuentros
            WHERE actividades LIKE ? OR ciudad LIKE ?
        `;

        // Ejecutamos ambas búsquedas AL MISMO TIEMPO (Promise.all) para que sea más rápido
        const [resultadosProductos, resultadosEncuentros] = await Promise.all([
            db.query(queryProductos, { replacements: [busquedaSQL, busquedaSQL] }),
            db.query(queryEncuentros, { replacements: [busquedaSQL, busquedaSQL] })
        ]);

        // Renderizamos la vista de resultados pasando lo encontrado
        res.render('fijo/buscador', {
            termino: textoBuscado,
            productos: resultadosProductos[0], // [0] contiene las filas del resultado en db.query
            encuentros: resultadosEncuentros[0]
        });

    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).send("Error interno al realizar la búsqueda");
    }
};
