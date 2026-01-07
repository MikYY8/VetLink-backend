import express from "express";
import { getVetProfile, updateVetProfile } from "../controllers/vetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authVetMiddleware } from "../middlewares/authVetMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, authVetMiddleware, getVetProfile);
router.put("/me", authMiddleware, authVetMiddleware, updateVetProfile);

export default router;
