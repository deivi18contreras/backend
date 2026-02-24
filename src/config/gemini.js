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
Eres un experto en e-commerce y marketing digital.
Crea una descripción persuasiva para:

Producto: ${nombre}
Categoría: ${categoria}

- Máximo 100 palabras
- Tono profesional y atractivo
- Resalta beneficios
- No uses emojis
- No incluyas título

Devuelve solo la descripción.
`;

    return await this.generarContenido(prompt, {
      temperatura: 0.8,
      maxTokens: 250,
    });
  }
}

export default new GeminiClient();