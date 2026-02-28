import Producto from "../models/Producto.js"
import Categoria from "../models/Categoria.js"

export const postProducto = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, stock, vendedor_id, categoria_id } = req.body;

        const existeCategoria = await Categoria.findById(categoria_id);
        if (!existeCategoria) {
            return res.status(404).json({
                error: true,
                msg: "La categoría especificada no existe en la base de datos"
            });
        }
        let imagenes = [];
        if (req.files && req.files.length > 0) {
            imagenes = req.files.map((file, index) => ({
                url: file.path,          
                public_id: file.filename, 
                esPrincipal: index === 0  
            }));
        }

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            stock,
            vendedor_id,
            categoria_id,
            imagenes
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
        const productos = await Producto.obtenerConFiltro(req.query);
        res.json({
            ok: true,
            total: productos.length,
            productos
        })
    } catch (error) {
        next(error)
    }
};

export const putProducto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        if (req.files && req.files.length > 0) {
            data.imagenes = req.files.map((file, index) => ({
                url: file.path,
                public_id: file.filename,
                esPrincipal: index === 0
            }));
        }

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