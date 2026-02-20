import mongoose from "mongoose";

export const conectarMongo = async ()=> {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/marketplace_db");
        console.log("✅Mongo Conectado");

    } catch (error) {
        console.error("error Mongo:", error);

    }
};