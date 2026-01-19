import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])

import { getAvailableAppointmentsController, 
        generateAvailabilityController,
        createAppointmentController,
                // getVetAppointmentsController,
                // getAllAppointmentsController,
        } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

// Turnos disponibles (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.get("/available", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), getAvailableAppointmentsController);

        // PARA TESTEO, generar bloques de disponibilidad por veterinario
appointmentRouter.post("/availability/generate/:vetId", generateAvailabilityController)

// Crear turno (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.post("/make-appointment", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), createAppointmentController);








// // Turnos programados (PARA VETS)
// appointmentRouter.get("/scheduled", 
//         // authMiddleware, authRolesMiddleware(["VET"]),
//         // getVetAppointmentsController
//         );

// // Todos los turnos, habidos y por haber (PARA SECRETARIES / ADMINS)
// appointmentRouter.get("/all-appointments", 
//         // authMiddleware, authRolesMiddleware(["ADMIN", "SECRETARY"]),
//         // getAllAppointmentsController
//         );

export default appointmentRouter