import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])


const appointmentRouter = express.Router();

// Turnos disponibles (PARA OWNERS)
appointmentRouter.get("/available");

// Turnos programados (PARA VETS)
appointmentRouter.get("/scheduled");

// Todos los turnos, habidos y por haber (PARA SECRETARIES / ADMINS)
appointmentRouter.get("/scheduled");

export default ownerRouter