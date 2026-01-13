import express from "express";
import { registerController, registerVetController, 
        loginController, loginVetController, 
        renovateTokenController, getAllUsersController,
        getAllVetsController, 
        updateUserController, deleteUserController,
        updateVetController, deleteVetController
         } from "../controllers/userController.js"
import { registerValidation, loginValidation } from "../validations/userValidation.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])
import { authMiddleware } from "../middlewares/authMiddleware.js";

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

  // *** funciones EXCLUSIVAMENTE administrativas! ***

// listar todos los usuarios
userRouter.get("/allusers", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), getAllUsersController)
// listar todos los vets
userRouter.get("/allvets", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), getAllVetsController);
// editar un usuario
userRouter.put("/edit-user/:ownerId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), updateUserController)
// eliminar un usuario
userRouter.delete("/delete-user/:ownerId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), deleteUserController)
// editar un vet
userRouter.put("/edit-vet/:vetId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), updateVetController)
// eliminar un vet
userRouter.delete("/delete-vet/:vetId", authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]), deleteVetController)

export default userRouter