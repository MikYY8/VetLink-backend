import BloqueDisponible from "../models/availabilityBlockModel.js";
import Veterinario from "../models/vetModel.js";
import Turno from "../models/appointmentModel.js"

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
    async getVetAvailability ( vetId, date ) {
        const blocks = await generateBlocksForVet( vetId, date );

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

        // VERIFICACION 1.1 Valida pet
        const pet = await Mascota.findById(petId);
        if (!pet) {
            throw new Error("Mascota no encontrada");
        }

        // VERIFICACION 1.2 Validar ownership
        if (userRole === "OWNER") {
            if (pet.owner.toString() !== ownerId.toString()) {
            throw new Error("No tenés permiso para sacar turno para esta mascota");
            }
        }

        //  VERIFICACION 2: Verificar bloque disponible
        const block = await BloqueDisponible.findOne({
            vet: vetId,
            date,
            time,
            available: true,
        });
        
        console.log("Bloque: " + block)

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
        console.log("-------------------------")
        console.log("Turno: " + appointment)

        // VERIFICACION 3: Bloquear disponibilidad
        block.available = false;
        block.reason = "Turno reservado"
        await block.save();

        return appointment;
    };


    
};