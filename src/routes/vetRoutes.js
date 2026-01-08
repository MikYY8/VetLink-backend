import express from "express";
import { getVetProfile, updateVetProfile, getVetAgenda } from "../controllers/vetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js";
import { authVetMiddleware } from "../middlewares/authVetMiddleware.js";

const router = express.Router();

// Veterinario puede ver su perfil
router.get("/me", authMiddleware, authVetMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "VET"]), getVetProfile);

// Veterinario puede editar su perfil
router.put("/me", authMiddleware, authVetMiddleware, authRolesMiddleware(["ADMIN", "VET"]), updateVetProfile);

// Veterinario puede ver sus turnos
router.get("/:id/availability", authVetMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "VET"]), getVetAgenda);

export default router;
