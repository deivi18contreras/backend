import mongoose from "mongoose";

const ordenSchema = new mongoose.Schema({
    comprador_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ["pendiente", "pagado", "enviado", "cancelado"],
        default: "pendiente"
    }
},
    {
        timestamps: {
            createdAt: "fecha_creacion",
            updateAt: true
        }
    })


export default mongoose.model("Orden", ordenSchema)