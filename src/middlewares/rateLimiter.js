import rateLimit from "express-rate-limit";

export const generalRate = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message:{
        status: 429,
        error: "Demasiadas Solicitudes",
        msg: "Limite excedido. Intente de nuevo en 15 minutos"
    }
}) ;

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: {
        status: 409,
        error: "Seguridad: IP Bloqueada",
        msg: "Demasiados intentos. Por seguridad, no puedes intentar de nuevo por 1hora"
    }
});

export const iaLImiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
    message: {
        status: 429,
        msg: "Has agotado tu cupo de IA por hoy."
    }
})