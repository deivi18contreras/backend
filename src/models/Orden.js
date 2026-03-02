import mongoose from "mongoose";

const ordenSchema = new mongoose.Schema({
    comprador_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        producto_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto',
            required: true
        },
        cantidad: { type: Number, required: true, min: 1},
        precio_unitario: { type: Number, required: true },
        subtotal: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    direccion_envio: { type: String, required: true },
    metodo_pago: {
        type: String,
        enum: ['tarjeta', 'efecty', 'transferencia'],
        required: true
    },
    estado_pago: {
        type: String,
        enum: ['pendiente', 'completado', 'fallido'],
        default: 'pendiente'
    },
    notas: String,
    estado: {
        type: String,
        enum: ["pendiente", "pagado", "enviado", "cancelado", "entregado"],
        default: "pendiente"
    }
}, {
    timestamps: true
});

export default mongoose.model("Orden", ordenSchema);