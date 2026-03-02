import { Router } from "express";
import { postOrden, getOrdenes, getOrdenPorId, cancelarOrden } from "../controllers/ordenController.js";
import { autenticar } from "../middlewares/auth.js";
import { validacionesCrearOrden } from "../middlewares/validarOrden.js";
import { validarCampos } from "../middlewares/validaciones.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ordenes
 *   description: Gestión de órdenes del marketplace
 */

/**
 * @swagger
 * /api/ordenes:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Ordenes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrdenInput'
 *     responses:
 *       201:
 *         description: Orden creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orden'
 *       400:
 *         description: Error en la validación o creación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", autenticar, validacionesCrearOrden, validarCampos, postOrden);

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     summary: Obtener órdenes del usuario autenticado
 *     tags: [Ordenes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orden'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", autenticar, getOrdenes);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     description: Solo el usuario dueño de la orden o un admin puede verla.
 *     tags: [Ordenes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orden'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para ver esta orden
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", autenticar, getOrdenPorId);

/**
 * @swagger
 * /api/ordenes/{id}/cancelar:
 *   put:
 *     summary: Cancelar una orden
 *     description: Solo el dueño puede cancelar la orden si está en estado pendiente.
 *     tags: [Ordenes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden cancelada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orden'
 *       400:
 *         description: No se puede cancelar esta orden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para cancelar esta orden
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id/cancelar", autenticar, cancelarOrden);

export default router;