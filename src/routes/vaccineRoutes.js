import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js";
import { createVaccineController,
        getVaccinesByPetController,
        updateVaccineController
        } from "../controllers/vaccineController.js";

const vaccineRouter = express.Router();

// Crear vacuna 
vaccineRouter.post("/new-vaccine", authMiddleware, authRolesMiddleware(["VET"]), createVaccineController);

// Ver vacunas de una mascota 
vaccineRouter.get("/pet/:petId", authMiddleware, authRolesMiddleware(["OWNER", "VET", "ADMIN", "SECRETARY"]), getVaccinesByPetController);

// Modificar vacuna 
vaccineRouter.patch("/:vaccineId", authMiddleware, authRolesMiddleware(["VET"]), updateVaccineController);

export default vaccineRouter;
