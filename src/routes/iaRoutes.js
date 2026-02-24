import { Router } from "express";
import { postGenerarDescripcion } from "../controllers/iaController";
import {validacionIA} from "../middlewares/validarIA.js"
import {validarCampo} from "../middlewares/validaciones.js"
import {autenticar, requiereRol} from "../middlewares/auth.js"

const router = Router();

/**
 * @swagger
 * /api/ia/generar-descripcion:
 *   post:
 *     summary: Generar descripción automática para un producto
 *     tags: [IA]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Audífonos Sony WH-1000XM5"
 *               categoria:
 *                 type: string
 *                 example: "Electrónica"
 *     responses:
 *       200:
 *         description: Descripción generada exitosamente
 *       400:
 *         description: Error en los datos de entrada
 */
router.post("/generar-descripcion",  [autenticar, requiereRol(['admin', 'vendedor']), validacionIA, validarCampo], postGenerarDescripcion)

export default  router