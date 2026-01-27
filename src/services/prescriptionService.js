import Receta from "../models/prescriptionModel.js"
import Turno from "../models/appointmentModel.js"

export class prescriptionService {

        // Mostrar todas las recetas de una mascota
    async getPrescriptionByPet(petId){
        const prescription = await Receta.find({ pet: petId })
        .select("medication notes vet")
        .populate("vet", "firstName lastName specialty")
        .sort({ date: -1 });

        return prescription;
    };

        // Crear nueva receta para una mascota
    async createPrescription({appointmentId, vetId, medication, notes}){
        const appointment = await Turno.findById(appointmentId);
        if (!appointment) throw new Error("Turno no encontrado");

        if (appointment.vet.toString() !== vetId) throw new Error("No autorizado para este turno");

        const existingPrescription = await Turno.findOne({ appointment: appointmentId });
        if (existingPrescription) throw new Error("Este turno ya tiene una receta")

        const prescription = await Receta.create({
            appointment: appointmentId,
            pet: appointment.pet,
            vet: appointment.vet,
            date: appointment.date,
            medication,
            notes
        });

        return prescription;
    };

        // Modificar una receta
    async updatePrescription(prescriptionId, updateData){
        const prescription = await Receta.findById(prescriptionId);
        if (!prescription) throw new Error("No se encontró la receta");

        Object.assign(prescription, updateData);
        await prescription.save();

        return prescription;
    };

        // Eliminar una receta
    async deletePrescriptionController(prescriptionId){
        const prescription = await HistorialClinico.findById(prescriptionId);
        if (!prescription) throw new Error("Receta no encontrada");
    
        await prescription.deleteOne();

    };
};
