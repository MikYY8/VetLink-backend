import BloqueDisponible from "../models/AvailabilityBlockModel.js";
import Veterinario from "../models/vetModel.js";
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
    async getVetAvailability (vetId) {
        const vet = await Veterinario.findById(vetId);
        if (!vet) throw new Error("Veterinario no encontrado");
        const blocks = generateBlocksForVet(allBlocksAvailable);
        return await AvailabilityBlock.insertMany(blocks);
    };

    
};