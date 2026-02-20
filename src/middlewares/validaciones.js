import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    const erros = validationResult(req);

    if(!erros.isEmpty()){
        return res.status(400).json(erros)
    }
    next();
}