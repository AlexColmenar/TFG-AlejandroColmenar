import nodemailer from 'nodemailer';
import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos;

    try {
        const htmlContent = pug.renderFile(
            path.join(__dirname, '../views/confirmacionEmail.pug'),
            {
                nombre: nombre,
                enlace: `${process.env.BACKEND_URL}/confirmar/${token}`
            }
        );

        await transport.sendMail({
            from: '"Mentes Insólitas " <asociacionmentesinsolitas@gmail.com>',
            to: email,
            subject: 'Bienvenido - Confirma tu cuenta',
            html: htmlContent
        });

    } catch (error) {
        console.log('Error enviando email registro:', error);
    }
};

const emailCompra = async (datos) => {
    const { email, nombre, idPedido, rutaPdf } = datos;

    try {
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

const emailReserva = async (datos) => {
    const emailDestino = datos.email || datos.correo;
    const { nombre, idReserva, rutaPdf } = datos;

    if (!emailDestino) {
        console.log("ERROR: No hay destinatario definido en 'datos'");
        return;
    }

    try {
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