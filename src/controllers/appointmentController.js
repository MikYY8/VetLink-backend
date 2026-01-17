import { appointmentService } from "../services/appointmentService.js"

const as = new appointmentService();

    // OBTENER TURNOS DISPONIBLES (NO crea, solo MUESTRA)
export const getAvailableAppointmentsController = async (req, res) => {
  try{
    const { date, specialty, vetId } = req.query;
    console.log( "fecha: " + date + "especialidad: " + specialty + "ID del veterinario: " + vetId )

    const available = await as.getAvailableAppointments({
      date,
      specialty,
      vetId,
    });

    console.log( "Disponibilidad: " + available)

    res.status(200).json({
      message: "Turnos disponibles",
      data: available,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  };
};

    // CREAR BLOQUES DE DISPONIBILIDAD por vet
export const generateAvailabilityController = async (req, res) => {
  try {
    const { vetId } = req.params;
    // const { startDate, endDate } = req.body;

    const blocks = await as.getVetAvailability(
      vetId,
      // startDate,
      // endDate
    );

    res.status(201).json({
      message: "Disponibilidad generada",
      data: blocks,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
