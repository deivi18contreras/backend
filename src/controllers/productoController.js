import Producto from "../models/Producto.js"
import Categoria from "../models/Categoria.js"


export const postProducto = async (req, res) => {
    try {
        let { nombre, descripcion, precio, stock, vendedor_id, categoria_id } = req.body;

        if (!descripcion || descripcion.trim() === "") {
            const categoriaInfo = await Categoria.findById(categoria_id);
            const nombreCate = categoriaInfo ? categoriaInfo.nombre : "General"

            console.log("🤖 Generando descripción con IA...");
            descripcion = await generarDescripcionIA(nombre, nombreCate)
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
        res.status(500).json({ msg: "Error al obtener productos" })
    }
};

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.find()
            .populate('vendedor_id', 'nombre email')
            .populate('categoria_id', 'nombre');
        res.json(productos)
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el producto" })
    }
};

export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true });
        res.json({ msg: "Producto actualizado", productoActualizado })
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el producto" })
    }
};

export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await Producto.findByIdAndDelete(id);
        res.json({ msg: "Producto eliminado del marketplace" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el producto" });
    }
}