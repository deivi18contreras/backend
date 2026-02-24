import Producto from "../models/Producto.js"
import Categoria from "../models/Categoria.js"

export const postProducto = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, stock, vendedor_id, categoria_id } = req.body;

        const existeCategoria = await Categoria.findById(categoria_id);
        if (!categoria_id) {
            return res.status(404).json({
                error: true,
                msg: "La categoría especificada no existe en la base de datos"
            });
        }

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            stock,
            vendedor_id,
            categoria_id
        });
        await nuevoProducto.save();

        res.status(201).json({
            msg: "Producto creado con éxito",
            producto: nuevoProducto
        });

    } catch (error) {
        next(error);
    }
};

export const getProductos = async (req, res, next) => {
    try {
        const productos = await Producto.find()
            .populate('vendedor_id', 'nombre email')
            .populate('categoria_id', 'nombre')
            .sort({ fecha_creacion: -1 });
        res.json(productos)
    } catch (error) {
        next(error)
    }
};

export const putProducto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.categoria_id) {
            const existeCat = await Categoria.findById(data.categoria_id);
            if (!existeCat) {
                return res.status(400).json({ error: true, msg: "La categoría nueva no existe" });
            }
        }

        const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ error: true, msg: "Producto no encontrado" });
        };
        res.json({ msg: "Producto actualizado", productoActualizado })
        
    } catch (error) {
        next(error)
    }
};

export const deleteProducto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ error: true, msg: "Producto no encontrado" });
        }
        res.json({ msg: "Producto eliminado del marketplace" });
    } catch (error) {
        next(error)
    }
}