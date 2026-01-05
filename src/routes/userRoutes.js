import express from "express";
import { registerController, loginController, loginVetController, renovateTokenController } from "../controllers/userController.js"
import { registerValidation, loginValidation, loginVetValidation } from "../validations/userValidation.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerValidation, validationMiddleware, registerController);
userRouter.post("/login", loginValidation, validationMiddleware, loginController);
userRouter.post("/vet/login", loginVetValidation, validationMiddleware, loginVetController);
userRouter.post("/token", renovateTokenController);

export default userRouter