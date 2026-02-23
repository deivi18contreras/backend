import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({
            detalles: erros.array().map(err => ({
                campo: err.path,
                mensaje: err.msg
            }))
        })
    }
    next();
}