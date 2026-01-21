import Turno from "../models/appointmentModel.js";
import BloqueDisponible from "../models/availabilityBlockModel.js";
import Veterinario from "../models/vetModel.js";

const TURN_DURATION = 20;

    // CREAR BLOQUES DE TIEMPO, para los turnos
const generateTimeBlocks = (start, end) => {
    const blocks = [];
    let current = start;

    while (current < end) {
        blocks.push(current);
        const [h, m] = current.split(":").map(Number);
        const date = new Date();
        date.setHours(h);
        date.setMinutes(m + TURN_DURATION);
        current = date.toTimeString().slice(0, 5);
    }
    return blocks;
};

    // GENERAR bloques de disponibilidad en base a los horarios del veterinario
export const generateBlocksForVet = async (vetId, date) => {
    const vet = await Veterinario.findById(vetId);
    if (!vet) 
        {throw new Error("Veterinario no encontrado")
    };

    const allBlocks = generateTimeBlocks(
        vet.workSchedule.start,
        vet.workSchedule.end
    );

    const appointments = await Turno.find({
        vet: vetId,
        date,
        status: "SCHEDULED",
    });

    const blocked = await BloqueDisponible.find({ vet: vetId, date, available: false });

    const unavailableTimes = [
        ...appointments.map((a) => a.time),
        ...blocked.map((b) => b.time),
    ];

    return allBlocks.filter(t => !unavailableTimes.includes(t));
};

