import multer from "multer";
import path from "path";
import fs from "fs";

const crearDirectorios = () => {
    const directorios = ['uploads', 'uploads/productos', 'uploads/categorias'];
    directorios.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        crearDirectorios();
        let carpeta = 'uploads/productos';

        if (file.fieldname === 'imagen_icono' || file.fieldname === 'icono') {
            cb(null, 'uploads/categorias');
        }else{
            cb(null, 'uploads/productos');
        }
        
        cb(null, carpeta);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);

        cb(null, `${timestamp}-${random}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan: JPG, PNG, WEBP'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const subirImagenProducto = upload.array('iamgenes',10); 
export const subirIconoCategoria = upload.single('imagen_icono');