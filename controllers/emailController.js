import nodemailer from 'nodemailer';
import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // Usa SSL/TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Envía un correo con enlace único para que el usuario confirme su cuenta tras registrarse
const emailRegistro = async (datos) => {
    // Destructuramos los datos que nos llegan de la función de registro
    const { email, nombre, token } = datos;

    try {
        // Renderizamos una plantilla PUG a HTML pasándole las variables (nombre y el enlace mágico de confirmación)
        const htmlContent = pug.renderFile(
            path.join(__dirname, '../views/confirmacionEmail.pug'),
            {
                nombre: nombre,
                enlace: `${process.env.BACKEND_URL}/confirmar/${token}`
            }
        );

        // Disparamos el envío a través del transporte configurado previamente
        await transport.sendMail({
            from: '"Mentes Insólitas " <asociacionmentesinsolitas@gmail.com>',
            to: email,
            subject: 'Bienvenido - Confirma tu cuenta',
            html: htmlContent // Inyectamos la plantilla como cuerpo del correo
        });

    } catch (error) {
        console.log('Error enviando email registro:', error);
    }
};

// Envía un correo confirmando la compra de productos, adjuntando la factura en PDF
const emailCompra = async (datos) => {
    const { email, nombre, idPedido, rutaPdf } = datos;

    try {
        // Renderizamos la plantilla de recibo (que da las gracias por la compra)
        const htmlContent = pug.renderFile(
            path.join(__dirname, '../views/entradas.pug'),
            {
                nombre: nombre,
                idPedido: idPedido
            }
        );

        await transport.sendMail({
            from: '"Mentes Insólitas " <asociacionmentesinsolitas@gmail.com>',
            to: email,
            subject: `Pedido #${idPedido} Confirmado - Recibo Adjunto `,
            html: htmlContent,
            // Añadimos el PDF generado desde su ruta local al array de archivos adjuntos
            attachments: [
                {
                    filename: `Recibo-Pedido-${idPedido}.pdf`,
                    path: rutaPdf
                }
            ]
        });
    } catch (error) {
        console.log(' Error enviando email compra:', error);
    }
};

// Envía un email al usuario confirmando la reserva de un encuentro con las entradas adjuntas en PDF
const emailReserva = async (datos) => {
    // Soporte por si la propiedad llega como 'email' o como 'correo'
    const emailDestino = datos.email || datos.correo;
    const { nombre, idReserva, rutaPdf } = datos;

    // Validación extra para no fallar si no hay destinatario
    if (!emailDestino) {
        console.log("ERROR: No hay destinatario definido en 'datos'");
        return;
    }

    try {
        // Transformamos el pug de confirmación de encuentro en texto HTML listo para enviar
        const htmlContent = pug.renderFile(
            path.join(__dirname, '../views/entradasEncuentro.pug'),
            { nombre, idReserva }
        );

        await transport.sendMail({
            from: '"Mentes Insólitas" <asociacionmentesinsolitas@gmail.com>',
            to: emailDestino,
            subject: `Reserva #${idReserva} Confirmada - Entradas Adjuntas`,
            html: htmlContent,
            attachments: [
                {
                    // Adjuntamos el archivo pasándole el PDF de la entrada física
                    filename: `Entradas-Reserva-${idReserva}.pdf`,
                    path: rutaPdf
                }
            ]
        });

    } catch (error) {
        console.log('Error detallado enviando email:', error);
    }
};

export { emailRegistro, emailCompra, emailReserva };