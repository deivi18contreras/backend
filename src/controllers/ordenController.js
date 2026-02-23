import { body } from "express-validator";
import Orden from "../models/Orden.js"

export const getOrden = async (req, res ) => {
    try {
        const orden = await Orden.find();
        res.status(200).json({Orden})
    } catch (error) {
        res.status(400).json({error})
    }
};

export const postOrden = async (req, res) => {
    try {
        const {conprador_id, total, estado, } = req-body
    } catch (error) {
        
    }
}