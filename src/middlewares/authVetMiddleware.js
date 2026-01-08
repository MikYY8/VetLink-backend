// Chequea que el token de acceso sea de un usuario con rol VET

import jwt from "jsonwebtoken";

export const authVetMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No se encontró el token" });
  };

  const token = authHeader.split(" ")[1];

  try{
    const decoded = jwt.verify(token, process.env.JWT_ACCESS);
    if (decoded.role !== "VET" || decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Acceso restringido a veterinarios" });
    };

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  }catch(error){
    return res.status(401).json({ message: "Token inválido" });
  };
};
