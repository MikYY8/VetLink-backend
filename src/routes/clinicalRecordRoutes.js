import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])

import { createClinicalRecordController,
        getClinicalRecordsByPetController,
        updateClinicalRecordController,
        deleteClinicalRecordController
        } from "../controllers/clinicalRecordController.js";

const clinicalRecordRouter = express.Router();

// Ver historial clinico por mascota 
clinicalRecordRouter.get("/pet/:petId", authMiddleware, authRolesMiddleware(["VET", "OWNER"]), getClinicalRecordsByPetController);

// Agregar nuevo registro al historial clinico 
clinicalRecordRouter.post("/new-clinical-record", authMiddleware, authRolesMiddleware(["VET"]), createClinicalRecordController)

// Modificar registro del historial clinico por mascota 
clinicalRecordRouter.put("/pet/:clinicalRecordId", authMiddleware, authRolesMiddleware(["VET"]), updateClinicalRecordController);

// Eliminar registro del historial clinico por mascota 
clinicalRecordRouter.delete("/pet/:clinicalRecordId", authMiddleware, authRolesMiddleware(["VET"]), deleteClinicalRecordController);



export default clinicalRecordRouter