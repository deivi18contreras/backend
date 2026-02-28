import { body, param } from "express-validator";

export const validacionCrearCategoria =[
    body("nombre")
    .notEmpty().withMessage("El nombre de la categoría es obligatoria")
    .isLength({min:3}).withMessage("El nombre debe tener al menos 3 caracteres")
    .trim(),

    body("descripcion")
    .optional()
    .isLength({max:300}).withMessage("La descripcion no puede exceder los 300 caracteres"),

    body("palabras_clave")
        .optional()
        .customSanitizer(value => {
            if (typeof value === 'string') {
                return value.split(',').map(p => p.trim()).filter(p => p !== '');
            }
            return value;
        })
        .isArray().withMessage("Las palabras clave deben ser un arreglo de strings")
];

export const validacionesIdCategoria = [
    param("id")
    .isMongoId().withMessage("No es Un ID reconocido")
]