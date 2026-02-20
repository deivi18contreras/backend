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
    },
    palabras_clave:{
        type:[String],
        default:[]
    }
});
export default mongoose.model("Categoria",categoriaSchema)