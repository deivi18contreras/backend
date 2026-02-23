import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarToken } from '../utils/jwt.js';

export const registro = async (req, res, next) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ error: true, errores: errores.array() });
        }

        const { nombre, email, password, rol } = req.body;

        const usuarioExistente = await Usuario.buscarPorEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ error: true, mensaje: 'El email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: passwordHash,
            rol: rol || 'comprador'
        });

        const token = generarToken(nuevoUsuario);

        res.status(201).json({
            error: false,
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ error: true, mensaje: 'Credenciales incorrectas' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: true, mensaje: 'Credenciales incorrectas' });
        }

        const token = generarToken(usuario);

        res.json({
            error: false,
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

export const perfil = async (req, res, next) => {
    try {
        
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        
        if (!usuario) {
            return res.status(404).json({ error: true, mensaje: 'Usuario no encontrado' });
        }

        res.json({
            error: false,
            usuario
        });
    } catch (error) {
        next(error);
    }
};

export const cambiarPassword = async (req, res, next) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ error: true, errores: errores.array() });
        }

        const { passwordActual, passwordNueva } = req.body;
        const usuario = await Usuario.findById(req.usuario.id).select('+password');
        const esValida = bcrypt.compare(passwordActual, usuario.password);
        if (!esValida) {
            return res.status(401).json({ 
                error: true, 
                mensaje: 'La contraseña actual no coincide' 
            });
        }

        const esMismaPassword = bcrypt.compare(passwordNueva, usuario.password);
        if (esMismaPassword) {
            return res.status(400).json({ 
                error: true, 
                mensaje: 'La nueva contraseña no puede ser igual a la anterior' 
            });
        }

        const salt = await bcrypt.genSalt(12);
        usuario.password = await bcrypt.hash(passwordNueva, salt);
        
        await usuario.save();

        res.json({
            error: false,
            mensaje: 'Contraseña actualizada correctamente. El token actual ha sido invalidado conceptualmente, por favor re-inicie sesión.'
        });
    } catch (error) {
        next(error);
    }
};