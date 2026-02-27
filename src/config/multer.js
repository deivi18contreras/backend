import multer from "multer";
import path from "path"
import fs from "fs"

const crearDirectorios = () => {
    const directorios = [
        'uploads',
        'uploads/productos',
        'uploads/categorias'
    ];
    directorios.forEach(dir =>{
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive: true})
        }
    })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        crearDirectorios();

        let carpeta = 'uploads/productos';

        if(file.fieldname === 'imagen_icono' || file.fieldname === 'icono');{
            carpeta = 'uploads/categorias'
        }
        cb(null,carpeta);
    },
    filename: (req, file, cb ) =>{
        const extension = path.extname(file.originalname).toLowerCase();

        const timestamp = Date.now();
        const radom = Math.round(Math.random() * 1E9);

        const nombreUnico = `${timestamp}-${radom}-${extension}`;
        cb(null, nombreUnico);
    }
})
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan: JPG, PNG, WEBP'), false);
    }
};
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Máximo 5MB por archivo
    }
});

export const subirImagenProducto = upload.single('imagenes',5);
export const subirIconoCategoria = upload.single('imagen_icono');