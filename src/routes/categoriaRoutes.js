import { Router } from "express";
import {validarCampos} from "../middlewares/validaciones.js"
import {validacionCrearCategoria, validacionesIdCategoria} from "../middlewares/validarCategoria.js"

import {getCategorias, postCategoria, putCategoria, deleteCategoria}from "../controllers/categoriasController.js"

const router = Router();
/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags:
 *       - Categorías
 *     responses:
 *       200:
 *         description: Lista de categorías enviada correctamente
 */
router.get("/",getCategorias);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags:
 *       - Categorías
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
 *                 example: Electrónica
 *               descripcion:
 *                 type: string
 *                 example: Dispositivos y gadgets tecnológicos
 *               imagen_icono:
 *                 type: string
 *                 example: https://img.icons8.com/cpu
 *               palabras_clave:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - tecnologia
 *                   - gadgets
 *                   - pc
 *     responses:
 *       201:
 *         description: Categoría creada con éxito
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", [validacionCrearCategoria, validarCampos],postCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID
 *     tags:
 *       - Categorías
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Electrónica Premium
 *               descripcion:
 *                 type: string
 *                 example: Nueva descripción
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 */
router.put("/", [validacionesIdCategoria, validarCampos],putCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría por ID
 *     tags:
 *       - Categorías
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/", [validacionesIdCategoria, validarCampos], deleteCategoria);

export default router;