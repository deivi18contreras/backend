import { Router } from "express";
import { getProductos, postProducto, putProducto, deleteProducto } from "../controllers/productoController.js";
import { validacionIdProducto, validacionesCrearProducto } from "../middlewares/validarProducto.js";
import { validarCampos } from "../middlewares/validaciones.js";
import {autenticar, requiereRol} from "../middlewares/auth.js"

const router = Router(); 

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
 *     summary: Crear un producto con IA
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     description: Permite a Administradores y Vendedores crear un producto. La descripción puede ser generada vía IA Gemini.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado - Token faltante o inválido
 */
router.post(
  "/", [autenticar, requiereRol(['admin', 'vendedor']), validacionesCrearProducto, validarCampos], postProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No tienes permisos para editar este producto
 */
router.put(
  "/:id", [autenticar, requiereRol(['admin', 'vendedor']), validacionIdProducto, validarCampos], putProducto);
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