import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const generarDescripcionIA = async (nombreProducto, categoriaNombre) => {
    try {
        const model = genAi.getGenerativeModdel({model: "gemini-pro"});
        const prompt = `Actúa como un experto en marketing digital. 
        Genera una descripción atractiva y breve (máximo 100 palabras) para un producto llamado "${nombreProducto}" 
        que pertenece a la categoría "${categoriaNombre}". 
        Resalta sus posibles beneficios.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Error con Gemini:",error);
        return "Descripción no disponible en este momento"
    }
}