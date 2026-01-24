import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])

import { getAvailableAppointmentsController, 
        generateAvailabilityController,
        createAppointmentController,
        // cancelAppointmentController,
        getVetAgendaController,
        getVetDailyAgendaController,
        updateAppointmentStatusController,
        getDashboardController,
        getOwnerAppointmentsController,

        } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

// Turnos disponibles (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.get("/available", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), getAvailableAppointmentsController);

        // PARA TESTEO, generar bloques de disponibilidad por veterinario
appointmentRouter.post("/availability/generate/:vetId", generateAvailabilityController)

// Crear turno (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.post("/make-appointment", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), createAppointmentController);

// Cancelar turno (PARA OWNERS / SECRETARIES / ADMINS) lo saco porque esta mas completo el otro
// definitivamente no me olvidé de que ya tenia este hecho, como crees
// appointmentRouter.delete("/cancel/:appointmentId", authMiddleware, authRolesMiddleware(["OWNER", "VET", "SECRETARY", "ADMIN"]), cancelAppointmentController);

// Ver agenda de turnos del veterinario (FILTROS POR FECHA Y STATUS)
appointmentRouter.get("/vet-agenda", authMiddleware, authRolesMiddleware(["VET"]), getVetAgendaController)

// Ver agenda DIARIA del veterinario 
appointmentRouter.get("/vet-agenda/today", authMiddleware, authRolesMiddleware(["VET"]), getVetDailyAgendaController)

// Marcar turno como COMPLETED / CANCELLED
appointmentRouter.patch("/status/:appointmentId", authMiddleware, authRolesMiddleware(["VET", "OWNER", "SECRETARY", "ADMIN"]), updateAppointmentStatusController)

// Dashboard de la secretaria
appointmentRouter.get("/dashboard", authMiddleware, authRolesMiddleware(["SECRETARY", "ADMIN"]), getDashboardController)

// Ver turnos del OWNER
appointmentRouter.get("/my-appointments", authMiddleware, authRolesMiddleware(["OWNER", "ADMIN"]), getOwnerAppointmentsController)


export default appointmentRouter