import multer from "multer";
import path from "path";
import fs from "fs";
import { dir } from "console";

const crearDirectorios = () => {
    const directorios = [
        'uploads',
        'uploads/categorias',
        'uploads/productos'
    ];
    directorios.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    })
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        crearDirectorios();

        let carpeta = 'uploads';

        if (file.fieldname === 'imagen_categoria') {
            carpeta = 'uploads/categorias'
        } else if (file.fieldname === 'imagenes') {
            carpeta = 'uploads/productos'
        }
        cb(null, carpeta)
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const nombreUnico = `${timestamp}-${random}${extension}`

        cb(null, nombreUnico);
    }
});

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan: JPG, PNG, WEBP'), false)
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5
    }
});

export const subirImagenProducto = upload.array('imagenes', 5)
export const subirImagenCategoria = upload.single('imagen_categoria')