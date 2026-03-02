import GeminiClient from "../config/gemini.js";
import Producto from "../models/Producto.js"
import Orden from "../models/Orden.js"


export const postGenerarDescripcion = async (req, res, next) => {
    try {
        const { nombre, categoria } = req.body;

        const descripcioIA = await GeminiClient.generarDescripcionProducto(nombre, categoria);

        res.status(200).json({
            descripcio: descripcioIA
        });
    } catch (error) {
        res.status(500).json({
            mensaje: error.message || "Error al conectar con el servicio de IA"
        })
    }
}


export const getRecomendacionesPersonalizadas = async (req, res) => {
    try {
        const usuarioId = req.usuario.id; 
    
        const historialCompras = await Orden.find({ comprador_id: usuarioId })
            .populate('productos.producto_id') 
            .limit(5);

        if (!historialCompras || historialCompras.length === 0) {
            return res.status(200).json({ 
                mensaje: "Aún no tienes compras. ¡Explora nuestros productos!", 
                sugerencias: [] 
            });
        }

        const analisis = await GeminiClient.analizarPatronesYRecomendar(historialCompras);
       
        const productosSugeridos = await Producto.find({
            categoria: { $in: analisis.categoriasSugeridas },
            stock: { $gt: 0 } 
        }).limit(4);

        res.status(200).json({
            puntuacionInteres: analisis.score, 
            razon: analisis.explicacion, 
            sugerencias: productosSugeridos
        });

    } catch (error) {
        console.error("Error IA Recs:", error);
        res.status(500).json({ mensaje: "Error al generar recomendaciones" });
    }
};

export const postModerarProducto = async (req, res) => {
    try {
        const { descripcion } = req.body;

        const moderacion = await GeminiClient.revisarContenidoInapropiado(descripcion);

        if (!moderacion.aprobado) {
            return res.status(400).json({
                estado: "Rechazado",
                motivo: moderacion.motivo,
                sugerencia: "Por favor, evita lenguaje ofensivo o datos de contacto externos."
            });
        }

        res.status(200).json({
            estado: "Aprobado",
            mensaje: "El contenido cumple con las políticas."
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el sistema de moderación" });
    }
};
