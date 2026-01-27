import { clinicalRecordService } from "../services/clinicalRecordService.js";

const crs = new clinicalRecordService();

// VER HISTORIAL CLINICO DE UNA MASCOTA
export const getClinicalRecordsByPetController = async (req, res) => {
  try {
    const { petId } = req.params;

    const records = await crs.getClinicalRecordsByPet(petId);

    res.status(200).json({
      message: "Historial clínico",
      data: records,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// AGREGAR UN NUEVO REGISTRO CLINICO linkeado al turno respectivo
export const createClinicalRecordController = async (req, res) => {
  try {
    const vetId = req.user.id; // sale del token
    const { appointmentId, reason, diagnosis, notes, treatment } = req.body;

    const clinicalRecord = await crs.createClinicalRecord({
      appointmentId, vetId, reason, diagnosis, notes, treatment });

    res.status(201).json({
      message: "Registro clínico creado correctamente",
      data: clinicalRecord,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// MODIFICAR REGISTRO CLINICO DE UNA MASCOTA
export const updateClinicalRecordController = async (req, res) => {
  try {
    const { clinicalRecordId } = req.params;
    const updateData = req.body;

    const updatedRecord = await crs.updateClinicalRecord(clinicalRecordId, updateData);

    res.status(200).json({
      message: "Registro del historial clínico modificado",
      data: updatedRecord,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ELIMINAR REGISTRO CLINICO DE UNA MASCOTA
export const deleteClinicalRecordController = async (req, res) => {
  try {
    const { clinicalRecordId } = req.params;

    await crs.deleteClinicalRecord(clinicalRecordId);

    res.status(200).json({
      message: "Registro del historial clínico eliminado",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


