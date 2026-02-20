import { Router } from "express";
import { validarCampos } from "../middlewares/validaciones.js";
import { validacionCrearUsuario, validacionId } from "../middlewares/validarUsuarios.js";
import { getUsuario, getUsuarioEmail, postUsuario, putUsuario, deleteUsuario } from "../controllers/usuarioController.js";

const router = Router();
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: rol
 *         schema:
 *           type: string
 *           enum: [comprador, vendedor, admin]
 *         description: Filtrar por rol
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o email
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: No autorizado
 */
router.get("/", getUsuario);



/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@ejemplo.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: MiPassword123!
 *               rol:
 *                 type: string
 *                 enum: [comprador, vendedor]
 *                 default: comprador
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Email ya registrado
 */
router.post("/", [validacionCrearUsuario, validarCampos], postUsuario);
/**
 * @swagger
 * /api/usuarios/buscar:
 *   get:
 *     summary: Buscar usuario por email
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.get("/buscar", getUsuarioEmail);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               rol:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put("/:id", [validacionId, validarCampos], putUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado
 */
router.delete("/:id", [validacionId, validarCampos], deleteUsuario);

export default router;