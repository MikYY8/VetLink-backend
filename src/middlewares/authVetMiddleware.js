import jwt from "jsonwebtoken";

export const authVetMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No se encontró el token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "VET") {
      return res.status(403).json({ message: "Acceso restringido a veterinarios" });
    }

    req.vet = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
