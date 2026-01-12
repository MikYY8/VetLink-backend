import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])
import { getAllPetsController, getPetDetailsController, createPetController, updatePetController, deletePetController } from "../controllers/petController.js"

const ownerRouter = express.Router();

// Ver mascotas por owner (SECRETARY / ADMIN)
ownerRouter.get("/pets/:ownerId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]), getAllPetsController);

// Ver una sola mascota
ownerRouter.get("/pets/mypet/:petId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]), getPetDetailsController);

// Crear mascota (OWNER crea sus mascotas, SECRETARY O ADMIN pueden crear mascotas para cualquier owner)
ownerRouter.post("/pets/add", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]), createPetController);

// Editar mascota (OWNER / SECRETARY / ADMIN)
ownerRouter.put("/pets/:petId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]), updatePetController);

// Eliminar (desactivar) mascota (OWNER / SECRETARY / ADMIN)
ownerRouter.delete("/pets/:petId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "OWNER"]), deletePetController);

export default ownerRouter