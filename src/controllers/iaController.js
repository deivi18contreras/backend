import GeminiClient from "../config/gemini.js";

export const postGenerarDescripcion = async (req, res) => {
    try {
        const {nombre, categoria } = req.body;

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