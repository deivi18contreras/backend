import mongoose from "mongoose";

const productoSchems = new mongoose.Schema({
    vendedor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: String,
        default: 0
    },
    imagen_url: {
        type: String
    },
    categoria_id: {
        tyupe: mongoose.Schema.Types.ObjectId, ref: 'categoria'
    }
},
    {
        timestamps: true
    })