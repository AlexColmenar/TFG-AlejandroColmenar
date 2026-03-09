import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pedidos } from '../models/pedidos.js';
import { detalles_pedidos } from '../models/detalles_pedidos.js';
import { productos } from '../models/productos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función auxiliar que estructura y dibuja el contenido del PDF de la factura
const dibujarFactura = (doc, pedido, usuarioNombre) => {
    // Definimos dónde está el logo de la empresa para incluirlo
    const logoPath = path.join(__dirname, '../public/img/portadaSin.png');

    // Si encuentra la imagen en el servidor, la estampa arriba a la izquierda
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 30, { width: 100 });
        doc.moveDown(4); // Deja un espacio en blanco debajo
    } else {
        // Fallback en caso de que no haya imagen: pone un texto de título
        doc.fontSize(20).text('MENTES INSÓLITAS', { align: 'center' });
        doc.moveDown();
    }

    // Cabecera: Escribe la información básica (fecha actual, id de pedido y nombre del pagador)
    doc.fontSize(10).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.text(`Nº Pedido: #${pedido.id}`);
    doc.text(`Cliente: ${usuarioNombre}`);
    doc.moveDown();

    // Dibuja la fila del encabezado de la tabla, usando una tipografía en negrita
    doc.font('Helvetica-Bold');
    doc.text('Producto', 50, doc.y);
    doc.text('Cant.', 300, doc.y);
    doc.text('Total', 450, doc.y);
    doc.font('Helvetica'); // Volvemos a letra normal
    doc.moveDown();

    // Recorre cada producto que venía dentro del pedido y va pintando una fila nueva por cada uno
    if (pedido.detalles) {
        pedido.detalles.forEach(item => {
            doc.text(item.producto.nombre, 50, doc.y, { width: 240 }); // Limita el ancho del texto por si es largo
            doc.text(item.cantidad.toString(), 300, doc.y);
            doc.text(item.subtotal + '€', 450, doc.y );
            doc.moveDown();
        });
    }

    // Pie de página de la tabla: Escribe el total a pagar destacado
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(14);
    doc.text(`TOTAL: ${pedido.total} €`, 400, doc.y);
};

// Genera el archivo PDF del último pedido finalizado del usuario para su descarga directa
const descargarFactura = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    try {
        // Buscamos en la base de datos el último pedido de este usuario que ya esté "finalizado"
        const pedido = await pedidos.findOne({
            where: { usuario_id: usuarioId, estado: 'finalizado' },
            order: [['fecha', 'DESC']], // Ordenamos para pillar siempre el más reciente
            include: [{ model: detalles_pedidos, as: 'detalles', include: [{ model: productos }] }]
        });

        if (!pedido) return res.redirect('/productos');

        // Inicializamos la librería PDFKit con márgenes por defecto
        const doc = new PDFDocument({ margin: 50 });

        // Avisamos al navegador que la respuesta no es una web HTML, sino un archivo descargable .pdf
        res.setHeader('Content-disposition', `attachment; filename="Factura-${pedido.id}.pdf"`);
        res.setHeader('Content-type', 'application/pdf');
        
        // Conectamos directamente el creador del PDF con la respuesta del servidor HTTP
        doc.pipe(res);

        // Llamamos a nuestra función auxiliar de arriba para que pinte todos los elementos gráficos del recibo
        dibujarFactura(doc, pedido, res.locals.usuario.nombre);

        // Le decimos a la librería que ya terminamos, y automáticamente el navegador iniciará la descarga
        doc.end();

    } catch (error) {
        console.log(error);
        res.redirect('/productos');
    }
};

export {
    descargarFactura,
    dibujarFactura
};