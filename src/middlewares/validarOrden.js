import { body } from "express-validator";

export const validacionesCrearOrden = [

    body("productos")
        .exists().withMessage("Debe enviar productos")
        .isArray({ min: 1 }).withMessage("Debe enviar al menos un producto"),

    body("productos.*.producto_id")
        .exists().withMessage("El producto_id es obligatorio")
        .isMongoId().withMessage("El ID del producto no es válido"),

    body("productos.*.cantidad")
        .exists().withMessage("La cantidad es obligatoria")
        .isInt({ min: 1 })
        .withMessage("La cantidad debe ser un número entero mayor a 0"),

    body("direccion_envio")
        .notEmpty()
        .withMessage("La dirección de envío es obligatoria")
        .isLength({ min: 5 })
        .withMessage("La dirección debe tener al menos 5 caracteres"),

    body("metodo_pago")
        .isIn(["tarjeta", "efecty", "transferencia"])
        .withMessage("Método de pago inválido"),

    body("notas")
        .optional()
        .isString()
        .withMessage("Las notas deben ser texto")
];