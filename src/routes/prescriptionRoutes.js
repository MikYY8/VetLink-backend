import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])

import { getPrescriptionByPetController,
        createPrescriptionController,
        updatePrescriptionController,
        deletePrescriptionController
        } from "../controllers/prescriptionController.js";

const prescriptionRouter = express.Router();

// Ver recetas por mascota
prescriptionRouter.get("/pet/:petId", authMiddleware, authRolesMiddleware(["VET", "OWNER"]), getPrescriptionByPetController);

// Agregar nueva receta
prescriptionRouter.post("/new-prescription", authMiddleware, authRolesMiddleware(["VET"]), createPrescriptionController)

// Modificar receta por mascota
prescriptionRouter.patch("/pet/:prescriptionId", authMiddleware, authRolesMiddleware(["VET"]), updatePrescriptionController);

// Eliminar receta por mascota
prescriptionRouter.delete("/pet/:prescriptionId", authMiddleware, authRolesMiddleware(["VET"]), deletePrescriptionController);

export default prescriptionRouter