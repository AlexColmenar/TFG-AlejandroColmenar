import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pedidos } from '../models/pedidos.js';
import { detalles_pedidos } from '../models/detalles_pedidos.js';
import { productos } from '../models/productos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dibujarFactura = (doc, pedido, usuarioNombre) => {
    const logoPath = path.join(__dirname, '../public/img/portadaSin.png');

    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 30, { width: 100 });
        doc.moveDown(4);
    } else {
        doc.fontSize(20).text('MENTES INSÓLITAS', { align: 'center' });
        doc.moveDown();
    }

    doc.fontSize(10).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.text(`Nº Pedido: #${pedido.id}`);
    doc.text(`Cliente: ${usuarioNombre}`);
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.text('Producto', 50, doc.y);
    doc.text('Cant.', 300, doc.y);
    doc.text('Total', 450, doc.y);
    doc.font('Helvetica');
    doc.moveDown();


    if (pedido.detalles) {
        pedido.detalles.forEach(item => {
            doc.text(item.producto.nombre, 50, doc.y, { width: 240 });
            doc.text(item.cantidad.toString(), 300, doc.y);
            doc.text(item.subtotal + '€', 450, doc.y );
            doc.moveDown();
        });
    }

    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(14);
    doc.text(`TOTAL: ${pedido.total} €`, 400, doc.y);
};


const descargarFactura = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    try {
        const pedido = await pedidos.findOne({
            where: { usuario_id: usuarioId, estado: 'finalizado' },
            order: [['fecha', 'DESC']],
            include: [{ model: detalles_pedidos, as: 'detalles', include: [{ model: productos }] }]
        });

        if (!pedido) return res.redirect('/productos');

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-disposition', `attachment; filename="Factura-${pedido.id}.pdf"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        dibujarFactura(doc, pedido, res.locals.usuario.nombre);

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