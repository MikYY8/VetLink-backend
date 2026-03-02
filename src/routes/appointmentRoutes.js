import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // token valido 
import { authRolesMiddleware } from "../middlewares/authRolesMiddleware.js" // (["OWNER", "ADMIN", "SECRETARY"])

import { generateAvailabilityController, 
        getAvailableAppointmentsController,
        getOnlyAvailableAppointmentsController,
        getVetAgendaController,
        getVetDailyAgendaController,
        getDashboardController,
        getAppointmentDetailsController,
        getOwnerAppointmentsController,
        getAppointmentsHistoryController,
        createAppointmentController,
        updateAppointmentStatusController,
        getVetsByAppointmentTypeController,
        getVaccinesBySpeciesController,
        updateAvailabilityBlockController
        } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

        // PARA TESTEO, generar bloques de disponibilidad por veterinario
appointmentRouter.post("/availability/generate/:vetId", generateAvailabilityController)

// Ver todos los bloques de turnos (SECRETARIES / ADMINS)
appointmentRouter.get("/available", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), getOnlyAvailableAppointmentsController);

// Ver turnos disponibles (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.get("/available-blocks", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), getAvailableAppointmentsController);

// Ver turnos del OWNER
appointmentRouter.get("/my-appointments", authMiddleware, authRolesMiddleware(["OWNER", "ADMIN"]), getOwnerAppointmentsController)

// Ver historial de turnos del OWNER
appointmentRouter.get("/my-appointments/history", authMiddleware, authRolesMiddleware(["OWNER", "ADMIN"]), getAppointmentsHistoryController)

// Ver agenda de turnos del veterinario (FILTROS POR FECHA Y STATUS)
appointmentRouter.get("/vet-agenda", authMiddleware, authRolesMiddleware(["VET"]), getVetAgendaController)

// Ver agenda DIARIA del veterinario 
appointmentRouter.get("/vet-agenda/today", authMiddleware, authRolesMiddleware(["VET"]), getVetDailyAgendaController)

// Ver dashboard de la secretaria
appointmentRouter.get("/dashboard", authMiddleware, authRolesMiddleware(["SECRETARY", "ADMIN"]), getDashboardController)

// Ver detalles de un turno
appointmentRouter.get("/dashboard/details/:appointmentId", authMiddleware, authRolesMiddleware(["SECRETARY", "ADMIN"]), getAppointmentDetailsController)

// Crear turno (PARA OWNERS / SECRETARIES / ADMINS)
appointmentRouter.post("/make-appointment", authMiddleware, authRolesMiddleware(["OWNER", "SECRETARY", "ADMIN"]), createAppointmentController);

// Editar status de turno como COMPLETED / CANCELLED
appointmentRouter.patch("/status/:appointmentId", authMiddleware, authRolesMiddleware(["VET", "OWNER", "SECRETARY", "ADMIN"]), updateAppointmentStatusController)

// Traer veterinarios por tipo de turno
appointmentRouter.get("/vets-by-type", authMiddleware, getVetsByAppointmentTypeController);

// Traer vacunas segun especie
appointmentRouter.get("/vaccines", authMiddleware, getVaccinesBySpeciesController);

// Bloquear turnos para que no se puedan reservar
appointmentRouter.patch("/block/:availabilityBlockId", authMiddleware, authRolesMiddleware(["VET", "OWNER", "SECRETARY", "ADMIN"]), updateAvailabilityBlockController)


export default appointmentRouter