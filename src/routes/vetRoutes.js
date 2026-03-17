import express from "express";
import { getVetProfile, updateVetProfile } from "../controllers/vetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js";
import { authVetMiddleware } from "../middlewares/authVetMiddleware.js";

const router = express.Router();  // TODO ESTO ESTÁ EN DESUSO

// Veterinario puede ver su perfil
router.get("/me", authMiddleware, authVetMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY", "VET"]), getVetProfile);

// Veterinario puede editar su perfil
router.put("/me", authMiddleware, authVetMiddleware, authRolesMiddleware(["ADMIN", "VET"]), updateVetProfile);


export default router;
