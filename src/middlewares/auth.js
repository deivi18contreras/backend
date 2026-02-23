import { generarToken, validarToken, extraerTokenDeHeader } from '../utils/jwt.js'
import Usuario from '../models/Usuario.js'

export const autenticar = async (req, res, next) => {
    try {
        const autHeader = req.headers.authorization;

        const token = extraerTokenDeHeader(autHeader);
        const payload = validarToken(token);
        const usuario = await Usuario.buscaraPorId(payload.id);

        if (!usuario) {
            return res.status(401).json({
                error: true,
                mensaje: 'Token válido, pero el usuario ya no existe en la base de datos'
            })
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(401).json({
            error: true,
            mensaje: error.message 
        });
    }
};

export const requiereRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: true,
                mensaje: 'No tienes permisos suficientes para realizar esta acción',
                permisos_necesarios: roles,
                tu_rol: req.usuario.rol
            });
        }
        
        next();
    };
};