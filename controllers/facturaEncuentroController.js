import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { reservas } from '../models/reservas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDFentrada = async (usuario, encuentro, reservaId) => {
    return new Promise((resolve, reject) => {
        try {
            const nombreArchivo = `Entrada-${reservaId}.pdf`;
            const rutaDestino = path.join(__dirname, '../public/entradas', nombreArchivo);

            const doc = new PDFDocument({ margin: 50 });

            const stream = fs.createWriteStream(rutaDestino);
            doc.pipe(stream);

            doc.fontSize(25).text('Entrada Oficial - Mentes Insólitas', { align: 'center' });
            doc.moveDown();

            doc.fontSize(18).text(`Evento: ${encuentro.espacio}`);
            doc.fontSize(14).text(`Ciudad: ${encuentro.ciudad}`);
            doc.text(`Fecha y Hora: ${encuentro.tiempo}`);
            doc.text(`Actividades: ${encuentro.actividades}`);
            doc.moveDown();

            doc.fontSize(16).text('Datos del Asistente:');
            doc.fontSize(14).text(`Nombre: ${usuario.nombre}`);
            doc.text(`Email: ${usuario.email}`);

            doc.moveDown(2);
            doc.fontSize(10).text('Por favor, presenta esta entrada (impresa o en el móvil) el día del evento.', { align: 'center' });

            doc.end();

            stream.on('finish', () => {
                resolve(rutaDestino);
            });

            stream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};

const descargarReserva = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    try {
        const reserva = await reservas.findOne({
            where: { usuario_id: usuarioId },
            order: [['id', 'DESC']]
        });

        if (!reserva) return res.redirect('/encuentros');

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-disposition', `attachment; filename="Reserva-${reserva.id}.pdf"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(25).text('Mentes Insólitas', { align: 'center' });
        doc.fontSize(18).text('Comprobante de Reserva', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Nº de Reserva: #${reserva.id}`);
        doc.text(`Cliente: ${res.locals.usuario.nombre}`);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        doc.fontSize(14).text('¡Tu reserva ha sido confirmada con éxito!', { align: 'left' });
        doc.moveDown();
        doc.fontSize(10).text('Recuerda que tienes la entrada completa con todos los detalles del encuentro en tu correo electrónico.', { oblique: true });
        // --------------------------------------------------------------------

        doc.end();

    } catch (error) {
        console.log(error);
        res.redirect('/encuentros');
    }
};

export {
    PDFentrada,
    descargarReserva
};