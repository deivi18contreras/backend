import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Marketplace Inteligente',
            version: '1.0.0',
            description: 'Documentación de la API para el Marketplace con integración de IA Gemini',
            contact: {
                name: 'Equipo de Desarrollo',
                email: 'deivi2023contreras@gmail.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor Local de Desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Usuario: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID de MongoDB',
                            example: '65f3a12b4f1a2c3d4e5f6789'
                        },
                        nombre: {
                            type: 'string',
                            example: 'Juan Pérez'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'juan@ejemplo.com'
                        },
                        rol: {
                            type: 'string',
                            enum: ['comprador', 'vendedor', 'admin'],
                            example: 'comprador'
                        },
                        fecha_registro: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },

                UsuarioInput: {
                    type: 'object',
                    required: ['nombre', 'email', 'password'],
                    properties: {
                        nombre: {
                            type: 'string',
                            example: 'Juan Pérez'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'juan@ejemplo.com'
                        },
                        password: {
                            type: 'string',
                            example: 'MiPassword123'
                        },
                        rol: {
                            type: 'string',
                            enum: ['comprador', 'vendedor', 'admin'],
                            default: 'comprador'
                        }
                    }
                },

                Producto: {
                    type: 'object',
                    required: ['nombre', 'precio', 'stock', 'vendedor_id', 'categoria_id'],
                    properties: {
                        _id: { type: 'string' },
                        nombre: { type: 'string', example: 'Audífonos Sony WH-1000XM5' },
                        descripcion: { type: 'string', example: 'Cancelación de ruido líder en la industria.' },
                        precio: { type: 'number', example: 350.00 },
                        stock: { type: 'integer', example: 15 },
                        vendedor_id: { type: 'string', description: 'ID del usuario vendedor' },
                        categoria_id: { type: 'string', description: 'ID de la categoría' },
                        fecha_creacion: { type: 'string', format: 'date-time' }
                    }
                },

                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'boolean', example: true },
                        mensaje: { type: 'string', example: 'Error descriptivo' },
                        detalles: {
                            type: 'array',
                            items: { type: 'object' }
                        }
                    }
                }
            }
        }
    },

    apis: ["./src/routes/*.js"]
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);