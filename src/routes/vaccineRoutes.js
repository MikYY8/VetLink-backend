import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js";
import { getVaccineHistoryController,
         getVaccineScheduleController,
        } from "../controllers/vaccineController.js";

const vaccineRouter = express.Router();

// Ver historial de vacunas de una mascota
vaccineRouter.get("/history/:petId", authMiddleware, authRolesMiddleware(["OWNER", "VET", "ADMIN"]), getVaccineHistoryController);

// Ver calendario de vacunas próximas de la mascota
vaccineRouter.get("/schedule/:petId", authMiddleware, authRolesMiddleware(["OWNER", "VET", "ADMIN"]), getVaccineScheduleController);

export default vaccineRouter;
