import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE

export const generarToken = (usuario) =>{
    const payload = {
        id: usuario._id,
        email: usuario.email,
        rorl: usuario.rol
    };
    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: JWT_EXPIRE,
        issuer: 'marketplace-api',
        audience: 'marketplace-users'
    })
};

export const validarToken = () =>{
    try {
        return jwt.verify(token, JWT_SECRET, {
            issuer: 'marketplace-api',
            audience: 'marketplace-users'
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('El token ha expirado, por favor inicia sesión nuevamente');
        }
        throw new Error('Token inválido o malformado');
    }

};


export const extraerTokenDeHeader = (authHeader) => {
    if (!authHeader) {
        throw new Error('No se proporcionó el token de seguridad');
    }

    if (!authHeader.startsWith('Bearer ')) {
        throw new Error('Formato de autenticación inválido. Usa: Bearer <token>');
    }

    return authHeader.substring(7);
};
