export const validarGeneracionIA = (req, res, next) => {
    const { nombre, categoria } = req.body;

    if (!nombre || nombre.trim().length < 3) {
        return res.status(400).json({ 
            error: true, 
            mensaje: 'El nombre del producto es obligatorio y debe tener al menos 3 caracteres para generar una descripción precisa.' 
        });
    }
    next();
};