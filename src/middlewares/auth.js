import { validarToken, extraerTokenDeHeader } from '../utils/jwt.js'
import Usuario from '../models/Usuario.js'

export const autenticar = async (req, res, next) => {
    try {
        const autHeader = req.headers.authorization;
        const token = extraerTokenDeHeader(autHeader);
        const payload = validarToken(token);

        if (!payload.id) {
            return res.status(401).json({ error: true, mensaje: "El token no contiene un ID de usuario válido" });
        }

        const usuario = await Usuario.findById(payload.id).select('-password');

        if (!usuario) {
            return res.status(401).json({ error: true, mensaje: "Usuario no encontrado en la base de datos" });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        next(error)
    }
};

export const requiereRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: 'No tienes permisos suficientes para realizar esta acción',
                permisos_necesarios: roles,
                tu_rol: req.usuario.rol
            });
        }
        
        next();
    };
};