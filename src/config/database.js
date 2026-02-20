import mongoose from "mongoose";

export const conectarMongo = async ()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongo Conectado");

    } catch (error) {
        console.error("error Mongo:", error);

    }
};