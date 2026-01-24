import HistorialClinico from "../models/clinicalRecordModel";
import Mascota from "../models/petModel";

export class clinicalRecordService {

    async createClinicalRecord(petId, vetId, date, reason, diagnosis, notes, treatment) {
        // verificar que la mascota exista
        const pet = await Mascota.findById(petId);
        if (!pet) throw new Error("Mascota no encontrada");

        const record = await HistorialClinico.create({
            pet: petId,
            vet: vetId,
            date: new Date(date),
            reason,
            diagnosis,
            notes,
            treatment,
        });

        return record;
    };

    async createClinicalRecord(petId){
        const records = await HistorialClinico.find({ pet: petId })
            .populate("vet", "firstName lastName specialty")
            .populate("pet", "name species breed")
            .sort({ date: -1 });

        return records;
    };



};