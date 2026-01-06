import express from "express";
import { registerController, registerVetController, loginController, loginVetController, renovateTokenController } from "../controllers/userController.js"
import { registerValidation, loginValidation } from "../validations/userValidation.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
// import { authVetMiddleware } from "../middlewares/authVetMiddleware.js" 
//  authVetMiddleware NO es para el LOGIN!!!! ES PARA RUTAS DEL VET

const userRouter = express.Router();

userRouter.post("/register", registerValidation, validationMiddleware, registerController);
userRouter.post("/vet/register", registerValidation, validationMiddleware, registerVetController);
userRouter.post("/login", loginValidation, validationMiddleware, loginController);
userRouter.post("/vet/login", loginValidation, validationMiddleware, loginVetController);
userRouter.post("/token", renovateTokenController);

export default userRouter