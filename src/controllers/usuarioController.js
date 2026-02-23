import { sendEmail } from "../utils/sendEmail.js"
import Usuario from "../models/Usuario.js"
import bcrypt from "bcryptjs"
import { validationResult } from "express-validator"

export const getUsuario = async (req, res, next) => {
    try {
        const filtros = {
            rol: req.query.rol,
            busqueda: req.query.q,
            pagina: req.query.pagina,
            limite: req.query.limite
        };
        const usuarios = await Usuario.obtenerTodos(filtros);

        res.json({
            usuarios,
            filtros_aplicados: filtros
        })
    } catch (error) {
        next(error)
    }
};

export const getUsuarioEmail = async (req, res, next) => {
    try {

        const { email } = req.query
        const usuarios = await Usuario.findOne({ email })

        if (!usuarios) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            })
        }
        res.json(usuarios)
    } catch (error) {
        next(error)
    }
};

export const getUsuarioById = async (req, res, next) => {
    try {
        const usuario = await Usuario.buscarPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: true, mensaje: "Usuario no encontrado" });
        }
        res.json({ error: false, usuario });
    } catch (error) {
        next(error);
    }
};

export const postUsuario = async (req, res, next) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ error: true, errores: errores.array() })
        }
        const { nombre, email, password, rol } = req.body
        const usuarioExistente = await Usuario.buscarPorEmail(email);
        if(usuarioExistente){
            return res.status(409).json({error: true, mensaje:'El email ya esta registrado'})
        }

        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(password, salt)

        const usuario = new Usuario({
            nombre,
            email,
            password: passwordHash,
            rol
        });
        await usuario.save()

        enviarEmailBienvenida(usuario)

        res.status(201).json({
            msg: 'Usuario registrado con éxito',
            usuario: {
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                fecha: usuario.fecha_registro
            }
        })

    } catch (error) {
        next(error)  
    }
}

export const putUsuario = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        ).select('-password')
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        res.json({ msg: "Usuario modificado correctamente", usuario })

    } catch (error) {
        next(error)
    }
}

export const deleteUsuario = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id)
        if (!usuario) {
            return res.status(404).json({
                msg: "Usuario no encontrado"
            })
        }
        res.json({
            msg: "Usuario eliminado correctamente"
        })
    } catch (error) {
        next(error)
    }
};

const enviarEmailBienvenida = async (usuario) => {
    try {
        await sendEmail({
            email: usuario.email,
            asunto: "¡Bienvenido al Marketplace!",
            mensaje: `Hola ${usuario.nombre}, gracias por registrarte.`
        });
    } catch (error) {
        console.error('Error al enviar email:', error.message);
    }
};