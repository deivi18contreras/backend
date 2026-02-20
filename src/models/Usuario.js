import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({ 
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    imagen_icono: {
        type: String
    }
});

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
    rol: {
        type: String,
        enum: ["comprador", "vendedor", "admin"],
        default: "comprador"
    },
    categoria: categoriaSchema, 
}, 
{ 
    
    timestamps: { 
        createdAt: "fecha_registro", 
        updatedAt: false       
    } 
});

export default mongoose.model("Usuario", usuarioSchema);