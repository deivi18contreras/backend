import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Marketplace Inteligente",
            version: "1.0.0",
            description: "Documentación oficial del Marketplace con integración de IA Gemini",
            contact: {
                name: "Equipo de Desarrollo",
                email: "deivi2023contreras@gmail.com"
            }
        },

        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Servidor local"
            }
        ],

        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },

            schemas: {

                Usuario: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "65f3a12b4f1a2c3d4e5f6789"
                        },
                        nombre: {
                            type: "string",
                            example: "Juan Pérez"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "juan@ejemplo.com"
                        },
                        rol: {
                            type: "string",
                            enum: ["comprador", "vendedor", "admin"],
                            example: "comprador"
                        },
                        fecha_registro: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },

                UsuarioInput: {
                    type: "object",
                    required: ["nombre", "email", "password"],
                    properties: {
                        nombre: {
                            type: "string",
                            example: "Juan Pérez"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "juan@ejemplo.com"
                        },
                        password: {
                            type: "string",
                            example: "MiPassword123"
                        },
                        rol: {
                            type: "string",
                            enum: ["comprador", "vendedor", "admin"],
                            default: "comprador"
                        }
                    }
                },

                Producto: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        nombre: { type: "string", example: "Audífonos Sony WH-1000XM5" },
                        descripcion: { type: "string", example: "Cancelación de ruido líder en la industria." },
                        precio: { type: "number", example: 350 },
                        stock: { type: "integer", example: 10 },
                        imagen: { type: "string", example: "uploads/productos/imagen.jpg" },
                        vendedor_id: { type: "string" },
                        categoria_id: { type: "string" },
                        fecha_creacion: { type: "string", format: "date-time" }
                    }
                },

                ProductoInput: {
                    type: "object",
                    required: ["nombre", "precio", "stock", "categoria_id"],
                    properties: {
                        nombre: { type: "string" },
                        descripcion: { type: "string" },
                        precio: { type: "number" },
                        stock: { type: "integer" },
                        categoria_id: { type: "string" },
                        imagen: {
                            type: "string",
                            format: "binary",
                            description: "Archivo de imagen del producto"
                        }
                    }
                },

                Categoria: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        nombre: { type: "string" },
                        descripcion: { type: "string" },
                        imagen_categoria: { type: "string" },
                        palabras_clave: {
                            type: "array",
                            items: { type: "string" }
                        },
                        fecha_creacion: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Orden: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        comprador_id: {
                            $ref: "#/components/schemas/Usuario"
                        },
                        productos: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    producto_id: {
                                        $ref: "#/components/schemas/Producto"
                                    },
                                    cantidad: { type: "integer", example: 2 },
                                    precio_unitario: { type: "number", example: 150 },
                                    subtotal: { type: "number", example: 300 }
                                }
                            }
                        },
                        total: { type: "number", example: 600 },
                        direccion_envio: { type: "string", example: "Calle 123 #45-67" },
                        metodo_pago: {
                            type: "string",
                            enum: ["tarjeta", "efecty", "transferencia"]
                        },
                        estado_pago: {
                            type: "string",
                            enum: ["pendiente", "completado", "fallido"]
                        },
                        estado: {
                            type: "string",
                            enum: ["pendiente", "pagado", "enviado",  "entregado", "cancelado"]
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },

                OrdenInput: {
                    type: "object",
                    required: ["productos", "direccion_envio", "metodo_pago"],
                    properties: {
                        productos: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["producto_id", "cantidad"],
                                properties: {
                                    producto_id: {
                                        type: "string",
                                        example: "65f3a12b4f1a2c3d4e5f6789"
                                    },
                                    cantidad: { type: "integer", example: 2 }
                                }
                            }
                        },
                        direccion_envio: {
                            type: "string",
                            example: "Calle 123 #45-67"
                        },
                        metodo_pago: {
                            type: "string",
                            enum: ["tarjeta", "efecty", "transferencia"]
                        },
                        notas: {
                            type: "string",
                            example: "Por favor entregar en horario laboral"
                        }
                    }
                },

                Error: {
                    type: "object",
                    properties: {
                        error: { type: "boolean", example: true },
                        mensaje: { type: "string", example: "Error descriptivo" },
                        detalles: {
                            type: "array",
                            items: { type: "object" }
                        }
                    }
                }

            }
        }
    },

    apis: ["./src/routes/*.js"]
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);