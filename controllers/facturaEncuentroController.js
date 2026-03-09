import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { reservas } from '../models/reservas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea un archivo PDF con los detalles de la entrada para un evento y lo guarda en el servidor
const PDFentrada = async (usuario, encuentro, reservaId) => {
    // Usamos una Promesa para que Node espere a que el archivo se termine de escribir en el disco físicamente
    return new Promise((resolve, reject) => {
        try {
            // Decidimos cómo se llamará el archivo y en qué ruta de nuestro servidor lo dejaremos almacenado
            const nombreArchivo = `Entrada-${reservaId}.pdf`;
            const rutaDestino = path.join(__dirname, '../public/entradas', nombreArchivo);

            const doc = new PDFDocument({ margin: 50 });

            // Creamos un túnel (stream) hacia la carpeta elegida
            const stream = fs.createWriteStream(rutaDestino);
            doc.pipe(stream); // Conectamos los pinceles de PDFKit con ese archivo

            // Vamos "pintando" los distintos textos de la entrada
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

            // Terminamos de editar el PDF
            doc.end();

            // Solo cuando termina verdaderamente de guardarse, "resolvemos" la promesa y pasamos la ruta al código que la pidió (para enviarla por email, por ej.)
            stream.on('finish', () => {
                resolve(rutaDestino);
            });

            // Si hay un error al escribir (por ejemplo permisos de disco denegados) lanzamos fallo
            stream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};

// Genera un PDF básico de comprobante de reserva para que el usuario pueda descargarlo desde su perfil
const descargarReserva = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    try {
        // Consultamos la última inscripción de este usuario
        const reserva = await reservas.findOne({
            where: { usuario_id: usuarioId },
            order: [['id', 'DESC']]
        });

        if (!reserva) return res.redirect('/encuentros');

        const doc = new PDFDocument({ margin: 50 });

        // Ajustamos las cabeceras HTTP para forzar al navegador a descargar el archivo en vez de abrirlo en pestaña nueva
        res.setHeader('Content-disposition', `attachment; filename="Reserva-${reserva.id}.pdf"`);
        res.setHeader('Content-type', 'application/pdf');
        
        // Empalmamos el flujo del PDF directamente a la respuesta web
        doc.pipe(res);

        // Diseñamos el documento con títulos y el número localizador de la BBDD
        doc.fontSize(25).text('Mentes Insólitas', { align: 'center' });
        doc.fontSize(18).text('Comprobante de Reserva', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Nº de Reserva: #${reserva.id}`);
        doc.text(`Cliente: ${res.locals.usuario.nombre}`);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        // Agregamos un texto descriptivo a modo de ticket informativo
        doc.fontSize(14).text('¡Tu reserva ha sido confirmada con éxito!', { align: 'left' });
        doc.moveDown();
        doc.fontSize(10).text('Recuerda que tienes la entrada completa con todos los detalles del encuentro en tu correo electrónico.', { oblique: true });

        // Cerramos archivo y la descarga comienza sola
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