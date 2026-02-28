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
    const query = filtros.incluir_inactivas === 'true' ? {} : { estado: true };

    if (filtros.busqueda) {
        query.$or = [
            { nombre: { $regex: filtros.busqueda, $options: 'i' } },
            { descripcion: { $regex: filtros.busqueda, $options: 'i' } },
            { palabras_clave: { $in: [new RegExp(filtros.busqueda, 'i')] } }
        ]
    }
    const limite = Math.min(parseInt(filtros.limite) || 10, 50);
    const pagina = parseInt(filtros.pagina) || 1;
    const skip = (pagina - 1) * limite;

    return await this.find(query)
        .sort({ nombre: 1 })
        .limit(limite)
        .skip(skip);

}
export default mongoose.model("Categoria", categoriaSchema)