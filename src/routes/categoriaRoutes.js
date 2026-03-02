import { Router } from "express";
import {validarCampos} from "../middlewares/validaciones.js"
import {validacionCrearCategoria, validacionesIdCategoria} from "../middlewares/validarCategoria.js"
import {getCategorias, postCategoria, putCategoria, deleteCategoria}from "../controllers/categoriasController.js"
import {autenticar, requiereRol} from "../middlewares/auth.js"
import {subirImagenCategoria} from "../config/multer.js"

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Categorías
 *     description: Gestión de categorías del marketplace
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
router.get("/", getCategorias);


/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría con imagen (Solo Admin)
 *     tags: [Categorías]
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
 *               imagen_categoria:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del icono (JPG, PNG, WEBP)
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
 *         description: Categoría creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 */

router.post("/", [autenticar,requiereRol(['admin']), subirImagenCategoria, validacionCrearCategoria, validarCampos], postCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID (Solo Admin)
 *     tags: [Categorías]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Electrónica Premium
 *               descripcion:
 *                 type: string
 *                 example: Nueva descripción actualizada
 *               imagen_categoria:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen (opcional)
 *               palabras_clave:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Categoría no encontrada
 */

router.put("/:id", [autenticar, requiereRol(['admin']), subirImagenCategoria, validacionesIdCategoria, validarCampos],putCategoria);


/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría por ID (Solo Admin)
 *     tags:
 *       - Categorías
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", [autenticar, requiereRol(['admin']), validacionesIdCategoria, validarCampos], deleteCategoria);

export default router;