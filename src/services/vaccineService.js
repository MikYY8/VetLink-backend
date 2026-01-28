import Vacuna from "../models/vaccineModel.js";
import CalendarioVacunatorio from "../models/vaccineScheduleModel.js";

export class vaccineService {

     // Obtener vacunas dadas a la mascota
    async getVaccineHistory(petId) {
        const vaccine = await Vacuna.find({ pet: petId })
            .populate("vet", "firstName lastName")
            .sort({ appliedDate: -1 });

        return vaccine;
    };

    // Obtener vacunas próximas de la mascota
    async getVaccineSchedule(petId) {
        const vaccine = await CalendarioVacunatorio.find({ pet: petId })
        .sort({ nextDueDate: 1 });

        return vaccine; 
    };

};

