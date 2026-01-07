// Chequea si el usuario tiene un token de ingreso válido
//  para iniciar sesion / seguir conectado
// (Igual el usuario seguramente no va a ver esto, es mas para logs
//              ME FALTA LOGGER)

import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const accesstoken = authHeader?.split(" ")[1];

    // Si no hay access token
    if (!accesstoken) {
        return res.status(401).json({ message: "Token no encontrado" }),
        console.log(err)
    }

    // Si el token está mal o se venció el tiempo de duración 
    jwt.verify(accesstoken, process.env.JWT_ACCESS, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado" });
        }
        req.user = user;
        next();
    });
};
