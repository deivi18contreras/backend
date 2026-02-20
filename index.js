import express from "express";
import cors from "cors";
import morgan from "morgan";
import 'dotenv/config'
import { conectarMongo } from "./src/config/database";

const app = express();
const PORT = process.env.PORT || 3000;
conectarMongo();

app.use(cors())
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);

})
