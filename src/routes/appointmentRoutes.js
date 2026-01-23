import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])

import { getAvailableAppointmentsController, 
        generateAvailabilityController,
        createAppointmentController,
        cancelAppointmentController,
        getVetAgendaController,
        getVetDailyAgendaController,
        updateAppointmentStatusController,

        } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

// Turnos disponibles (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.get("/available", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), getAvailableAppointmentsController);

        // PARA TESTEO, generar bloques de disponibilidad por veterinario
appointmentRouter.post("/availability/generate/:vetId", generateAvailabilityController)

// Crear turno (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.post("/make-appointment", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), createAppointmentController);

// Cancelar turno (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.delete("/cancel/:appointmentId", authMiddleware, authRolesMiddleware(["OWNER", "VET", "SECRETARY", "ADMIN"]), cancelAppointmentController);

// Ver agenda de turnos del veterinario (FILTROS POR FECHA Y STATUS)
appointmentRouter.get("/vet-agenda", authMiddleware, authRolesMiddleware(["VET"]), getVetAgendaController)

// Ver agenda DIARIA del veterinario 
appointmentRouter.get("/vet-agenda/today", authMiddleware, authRolesMiddleware(["VET"]), getVetDailyAgendaController)

// Marcar turno como COMPLETED / CANCELLED
appointmentRouter.patch("/status/:appointmentId", authMiddleware, authRolesMiddleware(["VET", "OWNER", "SECRETARY", "ADMIN"]), updateAppointmentStatusController)



export default appointmentRouter