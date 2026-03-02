import { Router } from "express";
import { getProductos, postProducto, putProducto, deleteProducto } from "../controllers/productoController.js";
import { validacionIdProducto, validacionesCrearProducto } from "../middlewares/validarProducto.js";
import { validarCampos } from "../middlewares/validaciones.js";
import {autenticar, requiereRol} from "../middlewares/auth.js";
import {subirImagenProducto} from "../config/multer.js"

const router = Router(); 

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos del marketplace
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Productos]
 *     description: Retorna una lista de todos los productos disponibles en el marketplace
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get("/", getProductos);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un producto con hasta 5 imágenes
 *     tags: [Productos]
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
 *               - precio
 *               - categoria_id
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Audífonos Sony WH-1000XM5
 *               descripcion:
 *                 type: string
 *                 example: Cancelación de ruido profesional
 *               precio:
 *                 type: number
 *                 example: 350
 *               stock:
 *                 type: integer
 *                 example: 10
 *               categoria_id:
 *                 type: string
 *                 example: 65f3a12b4f1a2c3d4e5f6790
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Hasta 5 archivos de imagen (JPG, PNG, WEBP)
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 */
router.post(
  "/", [autenticar, requiereRol(['admin', 'vendedor']), subirImagenProducto, validacionesCrearProducto, validarCampos], postProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto por ID (permite actualizar imágenes)
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria_id:
 *                 type: string
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Nuevas imágenes (opcional)
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 */
router.put(
  "/:id", [autenticar, requiereRol(['admin', 'vendedor']),subirImagenProducto, validacionIdProducto, validarCampos], putProducto);
  
/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete(
  "/:id", [autenticar, requiereRol(['admin', 'vendedor']), validacionIdProducto, validarCampos], deleteProducto);

export default router;