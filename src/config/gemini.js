import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1";

class GeminiClient {
  constructor() {
    this.client = axios.create({
      baseURL: GEMINI_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async generarContenido(prompt, opciones = {}) {
    if (!GEMINI_API_KEY) {
      throw new Error("API Key de Gemini no configurada en el .env");
    }

    try {
      const response = await this.client.post(
        `/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: opciones.temperatura ?? 0.7,
            maxOutputTokens: opciones.maxTokens ?? 300,
          },
        }
      );

      const texto =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!texto) {
        throw new Error("Gemini devolvió respuesta vacía");
      }

      return texto.trim();

    } catch (error) {
      console.error("❌ Error Gemini:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || "Error al generar contenido con IA"
      );
    }
  }

  async generarDescripcionProducto(nombre, categoria) {
    const prompt = `
      Eres un experto en e-commerce. Crea una descripción persuasiva para:
      Producto: ${nombre}
      Categoría: ${categoria}
      - Máximo 100 palabras, tono profesional, sin emojis.
      Devuelve solo el texto de la descripción.`;

    return await this.generarContenido(prompt, { temperatura: 0.8 });
  }

  async analizarPatronesYRecomendar(historial) {
    const prompt = `
      Actúa como un analista de datos de Marketplace. 
      Basado en este historial de compras: ${JSON.stringify(historial)}
      
      Analiza los patrones y devuelve un JSON estrictamente con este formato:
      {
        "categoriasSugeridas": ["nombre_categoria1", "nombre_categoria2"],
        "score": 0.95,
        "explicacion": "Breve razón de la recomendación"
      }
      Responde SOLO el objeto JSON.`;

    const respuesta = await this.generarContenido(prompt, { temperatura: 0.3 });
 
    return JSON.parse(respuesta.replace(/```json|```/g, ""));
  }

  async moderarContenido(texto) {
    const prompt = `
      Actúa como moderador de contenido para un Marketplace.
      Analiza el siguiente texto: "${texto}"
      
      Detecta: lenguaje ofensivo, datos de contacto (teléfonos, emails) o estafas.
      Devuelve un JSON estrictamente con este formato:
      {
        "aprobado": boolean,
        "motivo": "string explicativo si es rechazado, o vacío si es aprobado"
      }
      Responde SOLO el objeto JSON.`;

    const respuesta = await this.generarContenido(prompt, { temperatura: 0.1 });
    return JSON.parse(respuesta.replace(/```json|```/g, ""));
  }
}

export default new GeminiClient();