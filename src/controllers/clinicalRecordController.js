import { clinicalRecordService } from "../services/clinicalRecordService.js";
import HistorialMedico from "../models/clinicalRecordModel";

const crs = new clinicalRecordService();

// AGREGAR UN NUEVO REGISTRO CLINICO
export const createClinicalRecordController = async (req, res) => {
  try {
    const vetId = req.user.id; // sale del token
    const { petId, date, reason, diagnosis, notes, treatment } = req.body;

    const record = await crs.createClinicalRecord({
      petId, vetId, date, reason, diagnosis, notes, treatment });

    res.status(201).json({
      message: "Registro clínico creado correctamente",
      data: record,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// VER REGISTRO CLINICO DE UNA MASCOTA
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
