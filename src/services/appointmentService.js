import mongoose from "mongoose";
import BloqueDisponible from "../models/availabilityBlockModel.js";
import Veterinario from "../models/vetModel.js";
import Turno from "../models/appointmentModel.js"
import Mascota from "../models/petModel.js"

import { generateBlocksForVet } from "../services/availabilityService.js"

export class appointmentService {
    // OBTENER TURNOS DISPONIBLES 
    async getAvailableAppointments ({ date, specialty, vetId }) {
        if (!date) throw new Error("La fecha es obligatoria");
        const query = {date, isAvailable: true};

        // Filtrar por veterinario
        if (vetId) {
            query.vet = vetId;
        };

        // Filtrar por especialidad
        if (specialty) {
            const vets = await Veterinario.find({ specialty }).select("_id");
            query.vet = { $in: vets.map(v => v._id) };
        };

        const availableBlocks = await BloqueDisponible.find(query).populate("vet", "firstName lastName specialty");
        return availableBlocks;
    };

        // CREAR BLOQUES DE DISPONIBILIDAD POR VET
    async getVetAvailability (vetId, date) {
        const blocks = await generateBlocksForVet(vetId, date);

        const allBlocks = blocks.map(time => ({
            vet: vetId,
            date,
            time,
            available: true,
        }));

        return await BloqueDisponible.insertMany(allBlocks);
    };

        // CREAR TURNO (POR FIN QUE EMOCION)
    async createAppointment({ petId, vetId, ownerId, date, time, type, details }) {

        //  VERIFICACION 1: Verificar bloque disponible
        const block = await BloqueDisponible.findOne({
            vet: vetId,
            date,
            time,
            available: true,
        });

        if (!block) throw new Error("El turno ya no está disponible");
        
        // Crear turno
        const appointment = await Turno.create({
            pet: petId,
            owner: ownerId,
            vet: vetId,
            date,
            time,
            type,
            details,
            price: 100,
            status: "SCHEDULED",
        });

        // VERIFICACION 2: Bloquear disponibilidad
        block.available = false;
        block.reason = "Turno reservado"
        await block.save();

        return appointment;
    };

    async cancelAppointment(appointmentId, userId, role) {
        const appointment = await Turno.findById(appointmentId);

        if (!appointment) throw new Error("Turno no encontrado");

        // Permisos
        if (role === "OWNER") {
            if (appointment.owner.toString() !== userId.toString()) {
            throw new Error("No tenés permiso para cancelar este turno");
            };
        };
        // !!!!!!!!!!!!!!!!!!!!!!!!!
        // !!!!!!!! UNTESTED !!!!!!!  aca no se si va a funcionar porque Vet no es un User .....
        // !!!!!!!!!!!!!!!!!!!!!!!!!
        if (role === "VET") {
            if (appointment.vet.toString() !== userId.toString()) {
            throw new Error("No tenés permiso para cancelar este turno");
            };
        };

        // Validación por si ya está cancelado
        if (appointment.status === "CANCELLED") {
            throw new Error("El turno ya está cancelado");
        };

        // Cancelar turno
        appointment.status = "CANCELLED";
        await appointment.save();

        // Liberar bloque 
        const block = await BloqueDisponible.findOne({
            vet: appointment.vet,
            date: appointment.date,
            time: appointment.time,
        });

        if (block) {
            block.available = true;
            block.reason = "Disponible"
            await block.save();
        };

        return appointment;
    };

    async getVetAgenda({ vetId, from, to, status }) {
        const filter = { vet: vetId };

            // filtro por fechas
        if (from || to) {
        filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) {
                const endOfDay = new Date(to);
                endOfDay.setHours(23, 59, 59, 999);
                filter.date.$lte = endOfDay;
            };
        };

            // filtro por estado
        if (status) filter.status = status.trim();

        const agenda = await Turno.find(filter)  // usamos los datos en filter para buscar turnos del vet
        .populate("pet", "name species")     // popular datos útiles
        .populate("owner", "firstName lastName")
        .sort({ date: 1, time: 1 });

        return agenda;
    };

    async updateAppointmentStatus(appointmentId, status, user) {
        const appointment = await Turno.findById(appointmentId);

        if (!appointment) throw new Error("Turno no encontrado");

        // validar estado permitido
        if (!["COMPLETED", "CANCELLED"].includes(status)) {
            throw new Error("Estado inválido");
        }

        // si es OWNER, solo puede cancelar su propio turno
        if (user.role === "OWNER") {
            if (appointment.owner.toString() !== user.id) {   // si el id del owner del appointment NO COINCIDE con el id del token
                throw new Error("No puedes modificar este turno");  // entonces intenta cancelar un turno de otro owner
            };
            if (status !== "CANCELLED") {
                throw new Error("No puedes modificar este valor");
            };
        };

        // evitar cambiar estados finales
        if (appointment.status !== "SCHEDULED") {
            throw new Error("El turno ya fue finalizado");
        };

        appointment.status = status;
        await appointment.save();

        // liberar bloque si se cancela
        if (status === "CANCELLED") {
            const block = await BloqueDisponible.findOne({
                vet: appointment.vet,
                date: appointment.date,
                time: appointment.time,
            });

            if (block) {
                block.available = true;
                await block.save();
            };
        };
        return appointment;
    };



    
};