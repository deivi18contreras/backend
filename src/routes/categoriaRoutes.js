import { Router } from "express";
import {validarCampos} from "../middlewares/validaciones.js"
import {validacionCrearCategoria, validacionesIdCategoria} from "../middlewares/validarCategoria.js"
import {getCategorias, postCategoria, putCategoria, deleteCategoria}from "../controllers/categoriasController.js"
import {autenticar, requiereRol} from "../middlewares/auth.js"
import {subirIconoCategoria} from "../config/multer.js"

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
 *     summary: Crear una nueva categoría con icono
 *     tags:
 *       - Categorías
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *                 format: binary
 *                 description: Archivo de imagen (JPG, PNG, WEBP) para el icono
 *               palabras_clave:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["tecnologia", "gadgets", "pc"]
 *     responses:
 *       201:
 *         description: Categoría creada con éxito
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado - Se requiere rol de administrador
 */

router.post("/", [autenticar,requiereRol(['admin']), subirIconoCategoria, validacionCrearCategoria, validarCampos], postCategoria);

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
router.put("/", [autenticar, requiereRol(['admin']), subirIconoCategoria, validacionesIdCategoria, validarCampos],putCategoria);

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
router.delete("/:id", [autenticar, requiereRol(['admin']), subirIconoCategoria, validacionesIdCategoria, validarCampos], deleteCategoria);

export default router;