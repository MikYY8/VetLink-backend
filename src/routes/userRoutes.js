import express from "express";
import { registerUserController, registerVetController, 
        loginController, renovateTokenController, 
        getAllUsersController, getAllVetsController, 
        updateUserController, updateVetController,
        deleteUserController, deleteVetController
         } from "../controllers/userController.js"
import { registerValidation, loginValidation } from "../validations/userValidation.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const userRouter = express.Router();

// Login usuario (OWNER, SECRETARY, ADMIN)
userRouter.post("/login", loginValidation, validationMiddleware, loginController);

// Renovar token 
userRouter.post("/token", renovateTokenController);


  // *** funciones EXCLUSIVAMENTE administrativas! ***


// Registrar usuario (OWNER por defecto)
userRouter.post("/register", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), registerValidation, validationMiddleware, registerUserController);

// Registrar Veterinario
userRouter.post("/vet/register", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), upload.single("photo"), registerValidation, validationMiddleware, registerVetController);

// Listar todos los usuarios
userRouter.get("/allusers", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), getAllUsersController)

// Listar todos los vets
userRouter.get("/allvets", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), getAllVetsController);

// Editar un usuario
userRouter.put("/update-user/:ownerId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), updateUserController)

// Eliminar un usuario
userRouter.delete("/delete-user/:ownerId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), deleteUserController)

// Editar un vet
userRouter.put("/update-vet/:vetId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), updateVetController)

// Eliminar un vet
userRouter.delete("/delete-vet/:vetId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), deleteVetController)

export default userRouter