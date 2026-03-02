import { Router } from "express";
import { postGenerarDescripcion, getRecomendacionesPersonalizadas, postModerarProducto } from "../controllers/iaController.js";
import { validarGeneracionIA } from "../middlewares/validarIA.js";
import { validarCampos } from "../middlewares/validaciones.js";
import { autenticar, requiereRol } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: IA
 *   description: Funcionalidades avanzadas potenciadas por Inteligencia Artificial
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 descripcion:
 *                   type: string
 *                   example: "Los Audífonos Sony WH-1000XM5 ofrecen cancelación de ruido avanzada, sonido de alta fidelidad y batería de larga duración."
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/generar-descripcion", [autenticar, requiereRol(['admin', 'vendedor']), validarGeneracionIA, validarCampos], postGenerarDescripcion);

/**
 * @swagger
 * /api/ia/recomendaciones:
 *   get:
 *     summary: Obtener recomendaciones personalizadas basadas en patrones de compra
 *     tags: [IA]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos recomendados con puntuación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   producto:
 *                     type: string
 *                     example: "Smartwatch Samsung Galaxy Watch"
 *                   puntuacion:
 *                     type: number
 *                     example: 0.92
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/recomendaciones", [autenticar], getRecomendacionesPersonalizadas);

/**
 * @swagger
 * /api/ia/moderar-contenido:
 *   post:
 *     summary: Moderación automática de contenido (descripciones)
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
 *               - texto
 *             properties:
 *               texto:
 *                 type: string
 *                 example: "Este es el mejor producto del mundo, llámame al 555-1234 para comprar."
 *     responses:
 *       200:
 *         description: Resultado de la moderación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: "Aprobado"
 *                 motivo:
 *                   type: string
 *                   example: "Contenido permitido según políticas."
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/moderar-contenido", [autenticar, requiereRol(['admin', 'vendedor']), validarGeneracionIA, validarCampos], postModerarProducto);

export default router;