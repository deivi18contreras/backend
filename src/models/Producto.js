import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({

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
        type: Number,
        default: 0
    },
    imagen_url: {
        type: String
    },
    vendedor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    }
},
    {
        timestamps: {
            createdAt: "fecha_creacion",
            updatedAt: "fecha_actualizacion"
        }
    });
export default mongoose.model("Producto", productoSchema)