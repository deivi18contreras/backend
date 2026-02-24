export const validarRegistro = (req, res, next) => {
     
        const { nombre, email, password } = req.body;
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: true, mensaje: 'El nombre es obligatorio' });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: true, mensaje: 'Debe ser un email válido' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: true, mensaje: 'El password debe tener al menos 6 caracteres' });
        }
        next();
}

export const validarLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, mensaje: 'Email y password son requeridos' });
    }
    next();
};