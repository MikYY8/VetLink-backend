import { prescriptionService } from "../services/prescriptionService.js";

const ps = new prescriptionService();

// VER RECETAS DE UNA MASCOTA
export const getPrescriptionByPetController = async (req, res) => {
    try{
        const { petId } = req.params
        
        const prescriptions = await ps.getPrescriptionByPet(petId)
        
        res.status(200).json({
        message: "Recetas",
        data: prescriptions,
        });
    }catch(error){
        res.status(400).json({ message: error.message });
    };
};

// CREAR RECETA PARA UNA MASCOTA linkeado al turno
export const createPrescriptionController = async (req, res) => {
    try{
        const vetId = req.user.id;
        const { appointmentId, medication, notes } = req.body;

        const prescription = await ps.createPrescription({
            appointmentId, vetId, medication, notes });
        
        res.status(201).json({
        message: "Receta creada correctamente",
        data: prescription,
        });
    }catch(error){
        res.status(400).json({ message: error.message });
    };
};

// MODIFICAR RECETA DE UNA MASCOTA
export const updatePrescriptionController = async (req, res) => {
    try{
        const { prescriptionId } = req.params;
        const updateData = req.body;

        const updatedPrescription = await ps.updatePrescription(prescriptionId, updateData);

        res.status(200).json({
            message: "Receta modificada correctamente",
            data: updatedPrescription,
        });
    }catch(error){
        res.status(400).json({ message: error.message });
    };
};

// ELIMINAR RECETA DE UNA MASCOTA
export const deletePrescriptionController = async (req, res) => {
    try{
        const { prescriptionId } = req.params;

        await ps.deletePrescriptionController(prescriptionId);

        res.status(200).json({
        message: "Receta eliminada correctamente",
        });
    }catch(error){
        res.status(400).json({ message: error.message });
    }

};

