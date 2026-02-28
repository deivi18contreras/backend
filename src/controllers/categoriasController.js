import Categoria from "../models/Categoria.js"


export const getCategorias = async (req, res, next) =>{
    try {
        const categorias = await Categoria.obtenerConFiltro(req.query);

        const total = await Categoria.countDocuments(
            req.query.incluir_inactivas === 'true' ? {} : { estado: true }
        );
        res.status(200).json({
            ok: true,
            total_db: total,
            total_pagina: categorias.length,
            pagina: parseInt(req.query.pagina) || 1,
            categorias
        })
    } catch (error) {
       next(error)
    }
};

export const postCategoria = async  (req, res, next) => {
    try {
        const {nombre, descripcion, palabras_clave} = req.body;
        const existe = await Categoria.findOne({nombre});

        if(existe){
            return res.status(400).json({
                msg: "Esta categoría ya existe"
            })
        }

        const nuevaCategoria = new Categoria ({
            nombre,
            descripcion,
            imagen_icono: req.file ? req.file.path : "",
            palabras_clave: Array.isArray(palabras_clave) ? palabras_clave : (palabras_clave ? palabras_clave.split(',') : [])
        });

        await nuevaCategoria.save()
        res.status(201).json({
            msg:"Categoría creada existosamente",
            categoria: nuevaCategoria
        })
    } catch (error) {
       next(error)
    }
};


export const putCategoria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        
        if (req.file) {
            data.imagen_icono = req.file.path;
        }

        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, data, { new: true });

        if (!categoriaActualizada) {
            return res.status(404).json({ msg: "Categoría no encontrada" });
        }
        res.json({ msg: "Categoría actualizada", categoriaActualizada });
    } catch (error) {
        next(error)
    }
};

export const deleteCategoria = async (req, res, next) =>{
    try {
        const {id} = req.params;
        const categoriaEliminada = await Categoria.findByIdAndDelete(id);

        if(!categoriaEliminada){
           return res.status(404).json({msg:"Categoría no encontrada"})
        }
        res.json({msg:"Categoría eliminada"})

    } catch (error) {
       next(error)
    }
}