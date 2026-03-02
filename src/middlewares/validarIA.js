export const validarGeneracionIA = (req, res, next) => {
    const { nombre } = req.body;

    if (!nombre || nombre.trim().length < 3) {
        return res.status(400).json({ 
            error: true, 
            mensaje: 'El nombre del producto es obligatorio y debe tener al menos 3 caracteres para generar una descripción precisa.' 
        });
    }
    next();
};

export const validarModeracionIA = (req, res, next) => {
    const { texto } = req.body; 

    if (!texto || texto.trim().length < 10) {
        return res.status(400).json({ 
            error: true, 
            mensaje: 'El texto es obligatorio y debe ser lo suficientemente largo para ser analizado.' 
        });
    }
    next();
};