import BloqueDisponible from "../models/availabilityBlockModel.js";
import Veterinario from "../models/vetModel.js";
import Turno from "../models/appointmentModel.js"
import Mascota from "../models/petModel.js";
import { dogVaccines, catVaccines } from "../utils/vaccineCatalog.js"
import Vacuna from "../models/vaccineModel.js";

import { generateBlocksForVet } from "../services/availabilityService.js"
import CalendarioVacunatorio from "../models/vaccineScheduleModel.js";

export class appointmentService {
    // OBTENER TURNOS DISPONIBLES 
    async getAvailableAppointments ({ date, specialty, vetId }) {
        if (!date) throw new Error("La fecha es obligatoria");

        const query = {date, available: true};

        // Filtrar por veterinario
        if (vetId) query.vet = vetId;

        // Filtrar por especialidad
        if (specialty) {
            const vets = await Veterinario.find({ specialty }).select("_id");
            query.vet = { $in: vets.map(v => v._id) };
        };

        const availableBlocks = await BloqueDisponible.find(query)
            .populate("vet", "firstName lastName specialty");

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

        const existing = await BloqueDisponible.find({ vet: vetId, date });
        if (existing.length > 0) return;    


        return await BloqueDisponible.insertMany(allBlocks);
    };

        // CREAR TURNO (POR FIN QUE EMOCION)
    async createAppointment({ petId, vetId, ownerId, date, time, type, details, vaccineName }) {

        //  VERIFICACION 1: Verificar bloque disponible
        const block = await BloqueDisponible.findOne({
            vet: vetId,
            date,
            time,
            available: true,
        });

        if (!block) throw new Error("El turno ya no está disponible");
        
        // si es vacunación, validar vacuna
        let selectedVaccine = null;

        // Si el owner selecciona VACUNACION, se habilita selección de vacuna
        if (type === "VACCINATION") {
            if (!vaccineName) throw new Error("Debe seleccionar una vacuna");

            const pet = await Mascota.findById(petId);
                if (!pet) throw new Error("Mascota no encontrada");

            let allowedVaccines = [];

            if (pet.species === "DOG") {        // si la mascota en cuestion es perro
                allowedVaccines = dogVaccines;  // mostrar SOLO vacunas de perro
            } else if (pet.species === "CAT") { // si es gato
                allowedVaccines = catVaccines;  // mostrar SOLO vacunas de gato
            } else {
                throw new Error("Especie no soportada para vacunación");
            };

            selectedVaccine = allowedVaccines.find(v => v.name === vaccineName);

            if (!selectedVaccine)   throw new Error("Vacuna no válida para esta especie");
        }

        // Crear turno
        const appointment = await Turno.create({
            pet: petId,
            owner: ownerId,
            vet: vetId,
            date,
            time,
            type,
            vaccineName: type == "VACCINATION" ? vaccineName : null,
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

        // Ver agenda del vet, tiene filtros pero tambien soporta la version compacta
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

        // Modificar estado de turno, para cancelar, o marcar como completados
    async updateAppointmentStatus(appointmentId, status, notes, user) {
        const appointment = await Turno.findById(appointmentId);

        if (!appointment) throw new Error("Turno no encontrado");

        // validar estado permitido
        if (!["COMPLETED", "CANCELLED"].includes(status)) throw new Error("Estado inválido");

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
        if (appointment.status !== "SCHEDULED") throw new Error("El turno ya fue finalizado");

        // guardar nuevo status
        appointment.status = status;
        await appointment.save();

        // si es vacunación y se completa -> llamar a vacunación
        if (status === "COMPLETED" && appointment.type === "VACCINATION") {
            await this.handleVaccination(appointment, notes);
        }
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

    async handleVaccination(appointment, notes) {
        const existingVaccine = await Vacuna.findOne({ appointment: appointment._id });
        if (existingVaccine) return;

        const pet = await Mascota.findById(appointment.pet);
        const catalog = pet.species === "DOG" ? dogVaccines : catVaccines;
        const vaccineInfo = catalog.find(v => v.name === appointment.vaccineName);

        if (!vaccineInfo) throw new Error("Vacuna no encontrada en catálogo");

        const appliedDate = appointment.date;
        const nextDueDate = new Date(appliedDate);
        nextDueDate.setDate(nextDueDate.getDate() + vaccineInfo.intervalDays);

        // guardar historial
        await Vacuna.create({
            pet: appointment.pet,
            vet: appointment.vet,
            appointment: appointment._id,
            vaccineName: appointment.vaccineName,
            appliedDate,
            notes: notes || ""
        });

        // crear o actualizar calendario
        const existingSchedule = await CalendarioVacunatorio.findOne({
            pet: appointment.pet,
            vaccineName: appointment.vaccineName
        });

        if (!existingSchedule) {
            await CalendarioVacunatorio.create({
            pet: appointment.pet,
            vaccineName: appointment.vaccineName,
            lastAppliedDate: appliedDate,
            nextDueDate
            });
        } else {
            existingSchedule.lastAppliedDate = appliedDate;
            existingSchedule.nextDueDate = nextDueDate;
            await existingSchedule.save();
        };
    };

        // Dashboard de secretaria
    async getDashboard({ date, from, to, vetId, status }) {
        const filter = {};

        // filtro por vet
        if (vetId) filter.vet = vetId;

        // filtro por estado
        if (status) filter.status = status.trim();
        
        // filtro por fecha exacta
        if (date) {
            const start = new Date(`${date}T00:00:00`);
            const end = new Date(`${date}T23:59:59.999`);
            filter.date = { $gte: start, $lte: end };
        }

        // filtro por rango
        if (from || to) {
            filter.date = {};

            if (from) filter.date.$gte = new Date(`${from}T00:00:00`);
            if (to) filter.date.$lte = new Date(`${to}T23:59:59.999`);
        }

        const appointments = await Turno.find(filter)
            .populate("vet", "firstName lastName")
            .populate("owner", "firstName lastName")
            .populate("pet", "name species")
            .sort({ date: 1, time: 1 });

        return appointments;
    };

        // Obtener turnos del owner
    async getOwnerAppointments({ ownerId, status }) {
        const filter = { owner: ownerId };

        // filtro por estado
        if (status) filter.status = status.trim();
        
        const appointments = await Turno.find(filter)
            .populate("vet", "firstName lastName specialty")
            .populate("pet", "name species")
            .sort({ date: 1, time: 1 });

        return appointments;
    };

        // Obtener historial de turnos del owner
    async getAppointmentsHistory({ ownerId, status }) {
        const filter = { owner: ownerId };

        // filtro por estado
        if (status) {
            filter.status = status.trim();
        } else {
            filter.status = { $in: ["COMPLETED", "CANCELLED"] };
        };
        
        const history = await Turno.find(filter)
            .populate("vet", "firstName lastName specialty")
            .populate("pet", "name species")
            .sort({ date: 1, time: 1 });

        return history;
    };
    
};