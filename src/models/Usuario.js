import mongoose from "mongoose";

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
}, 
{ 
    timestamps: { 
        createdAt: "fecha_registro", 
        updatedAt: false       
    } 
});

usuarioSchema.statics.buscarPorEmail = async function (email) {
    return await this.findOne({email})
};

usuarioSchema.statics.buscarPorId = async function (id) {
    return await this.findById(id).select('-password')  
};

usuarioSchema.statics.obtenerTodos = async function(filtros = {}) {
    const query = {};

    if (filtros.rol) {
        query.rol = filtros.rol;
    }

    if (filtros.busqueda) {
        query.$or = [
            { nombre: { $regex: filtros.busqueda, $options: 'i' } },
            { email: { $regex: filtros.busqueda, $options: 'i' } }
        ];
    }

    const limite = parseInt(filtros.limite) || 10;
    const pagina = parseInt(filtros.pagina) || 1;
    const skip = (pagina - 1) * limite;

    return await this.find(query)
        .select('-password')
        .sort({ fecha_registro: -1 })
        .limit(limite)
        .skip(skip);
};

export default mongoose.model("Usuario", usuarioSchema);