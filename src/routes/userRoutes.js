import express from "express";
import { registerController, registerVetController, loginController, loginVetController, renovateTokenController } from "../controllers/userController.js"
import { registerValidation, loginValidation } from "../validations/userValidation.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";

const userRouter = express.Router();

// Registrar usuario (OWNER por defecto)
userRouter.post("/register", registerValidation, validationMiddleware, registerController);

// Registrar Veterinario
userRouter.post("/vet/register", registerValidation, validationMiddleware, registerVetController);

// Login usuario (OWNER, SECRETARY)
userRouter.post("/login", loginValidation, validationMiddleware, loginController);

// Login Veterinario (mismas credenciales de un usuario normal)
// (es posible que termine refactorizando este, porque no tiene mucho sentido ...
// ... Lo unico que cambia es el model)
userRouter.post("/vet/login", loginValidation, validationMiddleware, loginVetController);

// Renovar token 
userRouter.post("/token", renovateTokenController);

export default userRouter