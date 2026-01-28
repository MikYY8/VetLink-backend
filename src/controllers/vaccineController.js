import vaccineService from "../services/vaccineService.js";

const vs = new vaccineService();

// CREAR VACUNA
export const createVaccineController = async (req, res) => {
  try {
    const vetId = req.user.id;
    const { petId, vaccineName, appliedDate, intervalDays, notes } = req.body;

    const vaccine = await vs.createVaccine({
      petId,
      vetId,
      vaccineName,
      appliedDate,
      intervalDays,
      notes
    });

    res.status(201).json({
      message: "Vacuna registrada correctamente",
      data: vaccine
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// VER VACUNAS DE UNA MASCOTA
export const getVaccinesByPetController = async (req, res) => {
  try {
    const { petId } = req.params;

    const vaccines = await vs.getVaccinesByPet(petId);

    res.status(200).json({
      message: "Vacunas de la mascota",
      data: vaccines
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ACTUALIZAR VACUNA
export const updateVaccineController = async (req, res) => {
  try {
    const { id } = req.params;

    const vaccine = await vs.updateVaccine(id, req.body);

    res.status(200).json({
      message: "Vacuna actualizada",
      data: vaccine
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
