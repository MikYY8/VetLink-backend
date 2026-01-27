import HistorialClinico from "../models/clinicalRecordModel.js";
import Turno from "../models/appointmentModel.js"

export class clinicalRecordService {

        // Ver historial clinico de la mascota en cuestión
    async getClinicalRecordsByPet(petId){
        const records = await HistorialClinico.find({ pet: petId })
            .select("date reason diagnosis notes treatment vet")
            .populate("vet", "firstName lastName specialty")
            .sort({ date: -1 });

        return records;
    };

        // Crear un nuevo registro clinico
    async createClinicalRecord({ appointmentId, vetId, reason, diagnosis, treatment, notes }) {
        const appointment = await Turno.findById(appointmentId);
        if (!appointment) throw new Error("Turno no encontrado");

        if (appointment.vet.toString() !== vetId) throw new Error("No autorizado para este turno");

        const existingRecord = await HistorialClinico.findOne({ appointment: appointmentId });
        if (existingRecord) throw new Error("Este turno ya tiene un registro clínico");

        const clinicalRecord = await HistorialClinico.create({
            appointment: appointmentId,
            pet: appointment.pet,
            vet: appointment.vet,
            date: appointment.date,
            reason,
            diagnosis,
            notes,
            treatment,
        });

        return clinicalRecord;
    };

        // Modificar un registro clinico
    async updateClinicalRecord(clinicalRecordId, updateData) {
        const clinicalRecord = await HistorialClinico.findById(clinicalRecordId);
        if (!clinicalRecord) throw new Error("Registro clínico no encontrado");

        Object.assign(clinicalRecord, updateData);
        await clinicalRecord.save();
          
        return clinicalRecord;
    };
    
        // Eliminar un registro clinico
    async deleteClinicalRecord(clinicalRecordId) {
        const clinicalRecord = await HistorialClinico.findById(clinicalRecordId);
        if (!clinicalRecord) throw new Error("Registro clínico no encontrado");
    
        await clinicalRecord.deleteOne();

    };

};