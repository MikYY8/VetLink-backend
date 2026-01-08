import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware" // (["OWNER", "ADMIN", "SECRETARY"])

const ownerRouter = express.Router();

// Ver todas las mascotas 
ownerRouter.get("/pets", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]));

// Ver una sola mascota
ownerRouter.get("/pets/:petId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]));

// Ver mascotas por owner (SECRETARY / ADMIN)
ownerRouter.get("/pets/owner/:ownerId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]));

// Crear mascota (OWNER crea sus mascotas, SECRETARY O ADMIN pueden crear mascotas para cualquier owner)
ownerRouter.post("/pets/add", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]));

// Editar mascota (OWNER / SECRETARY / ADMIN)
ownerRouter.put("/pets/:petId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]));

// Eliminar (desactivar) mascota (OWNER / SECRETARY / ADMIN)
ownerRouter.delete("/pets/:petId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]));

export default ownerRouter