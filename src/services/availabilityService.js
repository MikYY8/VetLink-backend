import Appointment from "../models/AppointmentModel.js";
import AvailabilityBlock from "../models/AvailabilityBlockModel.js";
import Vet from "../models/vetModel.js";

const TURN_DURATION = 20;

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

export const getVetAvailability = async (vetId, date) => {
    const vet = await Vet.findById(vetId);
    if (!vet) 
        {throw new Error("Veterinario no encontrado")
    };

    const allBlocks = generateTimeBlocks(
        vet.workSchedule.start,
        vet.workSchedule.end
    );

    const appointments = await Appointment.find({
        vet: vetId,
        date,
        status: "SCHEDULED",
    });

    const blocked = await AvailabilityBlock.find({ vet: vetId, date });

    const unavailableTimes = [
        ...appointments.map((a) => a.time),
        ...blocked.map((b) => b.time),
    ];

    return allBlocks.filter((t) => !unavailableTimes.includes(t));
};
