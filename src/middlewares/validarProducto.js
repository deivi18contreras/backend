import { body, param } from "express-validator";

export const validacionesCrearProducto =[
    body('nombre', 'El nombre es obligatorio y debe tener al menos 4 caracteres')
    .not()
    .isEmpty()
    .isLength({min:4}),

    body('precio', 'El precio es obligatorio y debe ser un número positivo')
    .isNumeric()
    .custom(value => value >= 0),

    body('stock', 'El stock debe ser un número entero no negativo')
    .isInt({min: 0}),

    body('vendedor_id','El ID del vendedor no es valido')
    .isMongoId(),

    body('categoria_id', 'El ID de la categoria no es válido')
    .isMongoId(),
];

export const validacionIdProducto = [
    param('id', 'El ID proporcionado no es un formato de mongoDB válido').isMongoId()
]