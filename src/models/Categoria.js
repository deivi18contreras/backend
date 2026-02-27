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
    palabras_clave: {
        type: [String],
        default: []
    },
    estado: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    });


categoriaSchema.statics.obtenerConFiltro = async function (filtros = {}) {
    const query = { estado: true };

    if (filtros.busqueda) {
        query.$or = [
            { nombre: { $regex: filtros.busqueda, $options: 'i' } },
            { palabras_clave: { $in: [new RegExp(filtros.busqueda, 'i')] } }
        ]
    }
    return await this.find(query).sort({ nombre: 1 })
}
export default mongoose.model("Categoria", categoriaSchema)