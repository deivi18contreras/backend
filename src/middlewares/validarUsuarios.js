import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validacionCrearUsuario =[
    body('nombre')
    .trim()
    .isLength({min:2})
    .withMessage('Nombre muy corto')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

    body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),

    body('password')
    .isLength({min:8})
    .withMessage('La contraseña debe tener minimo 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe tener al menos una minúscula, una mayúscula y un número'),

    body('rol')
    .optional()
    .isIn(['comprador', 'vendedor', 'admin'])
    .withMessage('Rol inválido')
];

export const validacionId = [
    param('id')
    .isMongoId()
    .withMessage('El id no es un formato de mongoDB válido')

]