import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Api Marketplace Inteligente',
            version: '1.0.0',
            descripcion: 'Documentacion de la API para el Marketplace Inteligente con integración de la IA Gemini'
        },
        servers: [
            { url: `http://localhost:${process.env.PORT || 3000}`, }
        ]
    },
    apis:[
        "./src/routes/*.js"
    ]
};

 export const swaggerDocs = swaggerJSDoc(swaggerOptions);