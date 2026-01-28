import Vacuna from "../models/vaccineModel.js";
import CalendarioVacunatorio from "../models/vaccineScheduleModel.js";

// Obtener vacunas dadas a la mascota
export class vaccineService{
    async getVaccineHistory(petId) {
    return await Vacuna.find({ pet: petId })
        .populate("vet", "firstName lastName")
        .sort({ appliedDate: -1 });
    };

    // Obtener vacunas próximas de la mascota
    async getVaccineSchedule(petId) {
    return await CalendarioVacunatorio.find({ pet: petId })
        .sort({ nextDueDate: 1 });
    };

};
