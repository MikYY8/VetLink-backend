import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])

import { createClinicalRecordController,
        getClinicalRecordsByPetController
    
        } from "../controllers/clinicalRecordController.js";

const clinicalRecordRouter = express.Router();

// Agregar nuevo registro al historial medico 
clinicalRecordRouter.post("/new", authMiddleware, authRolesMiddleware(["VET"]), createClinicalRecordController)
// authMiddleware, authRolesMiddleware(["VET", "OWNER", "SECRETARY", "ADMIN"])

// Ver historial por mascota 
clinicalRecordRouter.get("/pet/:petId", authMiddleware, authRolesMiddleware(["VET", "OWNER"]), getClinicalRecordsByPetController);

export default clinicalRecordRouter