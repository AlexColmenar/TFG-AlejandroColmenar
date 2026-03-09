import multer from 'multer';
import path from 'path';

// Configuración de multer para gestionar la subida de imágenes de los productos
const storage = multer.diskStorage({
    // Establece la carpeta de destino donde se guardarán las imágenes subidas
    destination: function (req, file, cb) {
        cb(null, './public/img/productos/')
    },
    // Genera un nombre de archivo único utilizando la fecha actual y la extensión original
    filename: function (req, file, cb) {
        const nombreUnico = Date.now() + path.extname(file.originalname);
        cb(null, nombreUnico);
    }
});

// Crea y exporta el middleware de subida listo para ser usado en las rutas
const upload = multer({ storage: storage });

export default upload;