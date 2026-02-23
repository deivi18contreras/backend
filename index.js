import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import 'dotenv/config'
import { conectarMongo } from "./src/config/database.js";
import { swaggerDocs } from "./src/config/swagger.js";
import swaggerUi from 'swagger-ui-express';
//rutas
import usuarioRoutes from "./src/routes/usuarioRoutes.js"
import productoRoutes from "./src/routes/productoRoutes.js"
import categoriaRoutes from "./src/routes/categoriaRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;
conectarMongo();


app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias',categoriaRoutes)

//documentacion
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`✅Servidor corriendo en puerto ${PORT}`);
    console.log(`📖 Documentación disponible en http://localhost:${PORT}/api-docs`);
})

