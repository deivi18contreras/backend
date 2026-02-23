import Categoria from "../models/Categoria.js"


export const getCategorias = async (req, res) =>{
    try {
        const Categorias = await Categoria.find();
        res.status(200).json({Categorias})
    } catch (error) {
        res.status(400).json({error})
    }
};

export const postCategoria = async  (req, res ) => {
    try {
        const {nombre, descripcion, imagen_icono, palabras_clave} = req.body;
        const existe = await Categoria.findOne({nombre});

        if(existe){
            return res.status(400).json({
                msg: "Esta categoría ya existe"
            })
        }

        const nuevaCategoria = new Categoria ({
            nombre,
            descripcion,
            imagen_icono,
            palabras_clave
        });

        await nuevaCategoria.save()
        res.status(201).json({
            msg:"Categoría creada existosamente",
            categoria: nuevaCategoria
        })
    } catch (error) {
        res.status(500).json({
            msg: "Hubo un error al crear la categoría"
        })
    }
};


export const putCategoria = async (req, res) =>{
    try {
        const {id} = req.params;
        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, req.body,{new: true});

        if(!categoriaActualizada){
            return res.status(404).json({msg:"Categoría no encontrada"})
        }
        res.json({msg:"Categoría actualizada", categoriaActualizada})
    } catch (error) {
        res.status(500).json({msg:"Hubo un error al actualizar"})
    }
};

export const deleteCategoria = async (req, res) =>{
    try {
        const {id} = req.params;
        const categoriaEliminada = await Categoria.findByIdAndDelete(id);

        if(!categoriaEliminada){
           return res.status(404).json({msg:"Categoría no encontrada"})
        }
        res.json({msg:"Categoría eliminada"})

    } catch (error) {
         res.status(500).json({ msg: error.message })
    }
}