import mongoose from 'mongoose';
import Orden from '../models/Orden.js';
import Producto from '../models/Producto.js';

export const postOrden = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productos, direccion_envio, metodo_pago, notas } = req.body;
        const comprador_id = req.usuario.id;
        
        let totalOrden = 0;
        const productosProcesados = [];

        for (const item of productos) {
            const productoDB = await Producto.findById(item.producto_id).session(session);

            if (!productoDB || productoDB.stock < item.cantidad) {
                throw new Error(`Stock insuficiente o producto no encontrado: ${item.producto_id}`);
            }

            const subtotal = productoDB.precio * item.cantidad;
            totalOrden += subtotal;

            productoDB.stock -= item.cantidad;
            await productoDB.save({ session });

            productosProcesados.push({
                producto_id: productoDB._id,
                cantidad: item.cantidad,
                precio_unitario: productoDB.precio,
                subtotal: subtotal
            });
        }

        const nuevaOrden = new Orden({
            comprador_id,
            productos: productosProcesados,
            total: totalOrden,
            direccion_envio,
            metodo_pago,
            estado_pago: 'pendiente', 
            notas,
            estado: 'pendiente'
        });

        await nuevaOrden.save({ session });
        await session.commitTransaction();
        
        res.status(201).json(nuevaOrden);

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};

export const getOrdenPorId = async (req, res) => {
    try {
        const orden = await Orden.findById(req.params.id)
            .populate('productos.producto_id')
            .populate('comprador_id');

        if (!orden) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }

        if (
            req.usuario.rol !== 'admin' &&
            orden.comprador_id._id.toString() !== req.usuario.id
        ) {
            return res.status(403).json({ error: "No autorizado" });
        }

        res.json(orden);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrdenes = async (req, res, next) => {
    try {
        let filtro = {};

        if (req.usuario.rol !== 'admin') {
            filtro = { comprador_id: req.usuario.id };
        }

        const ordenes = await Orden.find(filtro)
            .populate('comprador_id')
            .populate('productos.producto_id');

        res.json(ordenes);

    } catch (error) {
        next(error)
    }
};

export const cancelarOrden = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const orden = await Orden.findById(req.params.id).session(session);

        if (!orden) {
            throw new Error("Orden no encontrada");
        }

        if (orden.comprador_id.toString() !== req.usuario.id) {
            throw new Error("No autorizado");
        }

        if (orden.estado !== "pagado") {
            throw new Error("Solo se pueden cancelar órdenes pagadas");
        }

        
        for (const item of orden.productos) {
            const producto = await Producto.findById(item.producto_id).session(session);
            if (producto) {
                producto.stock += item.cantidad;
                await producto.save({ session });
            }
        }

        orden.estado = "cancelado";
        await orden.save({ session });

        await session.commitTransaction();
        res.json({ mensaje: "Orden cancelada correctamente" });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};