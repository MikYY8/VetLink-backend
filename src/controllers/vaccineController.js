import { vaccineService } from "../services/vaccineService.js"

const vs = new vaccineService();

// VER HISTORIAL DE VACUNAS RECIBIDAS DE UNA MASCOTA
export const getVaccineHistoryController = async (req, res) => {
  try {
    const { petId } = req.params;

    const history = await vs.getVaccineHistory(petId);

    res.status(200).json({
      message: "Historial de vacunas",
      data: history
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// VER CALENDARIO DE PRÓXIMAS VACUNAS DE UNA MASCOTA
export const getVaccineScheduleController = async (req, res) => {
  try {
    const { petId } = req.params;

    const schedule = await vs.getVaccineSchedule(petId);

    res.status(200).json({
      message: "Próximas vacunas",
      data: schedule
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


