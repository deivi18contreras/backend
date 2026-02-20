import { sendEmail } from "../helpers/sendEmail.js"
import Usuario from "../models/Usuario.js"
import bcrypt from "bcryptjs"

export const getUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.find()
        res.json(usuarios)
    } catch (error) {
        res.status(400).json({ error })
    }
}

export const getUsuarioEmail = async (req, res) => {
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
        res.status(500).json({
            error: error.message
        })
    }
}

export const postUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body

        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(password, salt)

        const usuario = new Usuario({
            nombre,
            email,
            password: passwordHash,
            rol
        });
        await usuario.save()

        try {
            await sendEmail(
                usuario.email,
                "¡Bienvenido al Marketplace!",
                `Hola ${usuario.nombre}, gracias por registrarte como ${usuario.rol}.`
            )
        } catch (mailError) {
            console.log('El usuario se guardo, pero fallo al enviar correo de bienvenida', mailError);
        }

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
        console.error(error);
        res.status(500).json({
            msg: "Hubo un error al registrar el usuario"
        })

    }
}

export const putUsuario = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre } = req.body

        const usuario = await Usuario.findByIdAndUpdate(id, { nombre },
            { new: true }
        )
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        res.json({ msg: "Usuario modificado correctamente", usuario })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params

        const usuario = await Usuario.findByIdAndDelete(id)

        if (!usuario) {
            return res.status(404).json({
                msg: "Usuario no encontrado"
            })
        }
        res.json({
            msg: "Usuario eliminado correctamente"
        })
    } catch (error) {
        res.status(500).json({ msg: error.message })

    }
}