import Vacuna from "../models/vaccineModel.js";
import vaccineCatalog from "../utils/vaccineCatalog.js"

// Crear vacuna
export const createVaccine = async ({ petId, vetId, vaccineName, appliedDate, intervalDays, notes }) => {

  const nextDueDate = new Date(appliedDate);
  nextDueDate.setDate(nextDueDate.getDate() + intervalDays);

  const vaccine = await Vacuna.create({
    pet: petId,
    vet: vetId,
    vaccineName,
    appliedDate,
    nextDueDate,
    notes
  });

  return vaccine;
};

// Obtener vacunas por mascota
export const getVaccinesByPet = async (petId) => {
  return await Vacuna.find({ pet: petId })
    .populate("vet", "firstName lastName")
    .sort({ appliedDate: -1 });
};

// Actualizar vacuna (PATCH)
export const updateVaccine = async (id, data) => {
  return await Vacuna.findByIdAndUpdate(id, data, { new: true });
};
