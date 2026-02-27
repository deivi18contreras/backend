import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import 'dotenv/config'

import { generalRate } from "./src/middlewares/rateLimiter.js";
import { conectarMongo } from "./src/config/database.js";
import { swaggerDocs } from "./src/config/swagger.js";
import swaggerUi from 'swagger-ui-express';

//rutas
import usuarioRoutes from "./src/routes/usuarioRoutes.js"
import productoRoutes from "./src/routes/productoRoutes.js"
import categoriaRoutes from "./src/routes/categoriaRoutes.js"
import authRoutes from "./src/routes/authRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;
conectarMongo();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', generalRate);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/auth', authRoutes)

//documentacion
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res) => {
    res.status(404).json({
        error: true,
        mensaje: 'Endpoint no encontrado'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: true,
        mensaje: err.message || 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`✅Servidor corriendo en puerto ${PORT}`);
    console.log(`📖 Documentación disponible en http://localhost:${PORT}/api-docs`);
})

