import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    descripcion_ia: {
        type: String,
        descripcion: ""
    },
    analisis_ia: {
        type: Object,
        default: {}
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
        type: String,
        default: ""
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

productoSchema.statics.obtenerConFiltro = async function (filtros = {}) {
    const query = {};

    if (filtros.categoria_id) query.categoria_id = filtros.categoria_id;
    if (filtros.vendedor_id) query.vendedor_id = filtros.vendedor_id;

    if (filtros.precio_min || filtros.precio_max) {
        query.precio = {}

        if (filtros.precio_min) query.precio.$gte = Number(filtros.precio_min);
        if (filtros.precio_max) query.precio.$lte = Number(filtros.precio_max);
    }

    if (filtros.en_stock === 'true') {
        query.stock = { $gt: 0 };
    }

    if (filtros.busqueda) {
        query.$or = [
            { nombre: { $regex: filtros.busqueda, $options: 'i' } },
            { descripcion: { $regex: filtros.busqueda, $options: 'i' } }
        ];
    }

    const limite = Math.min(parseInt(filtros.limite) || 10, 50);
    const pagina = parseInt(filtros.pagina) || 1;
    const skip = (pagina - 1) * limite;

    return await this.find(query)
        .populate('vendedor_id', 'nombre email')
        .populate('categoria_id', 'nombre')
        .sort({ fecha_creacion: -1 })
        .limit(limite)
        .skip(skip);
};

export default mongoose.model("Producto", productoSchema)