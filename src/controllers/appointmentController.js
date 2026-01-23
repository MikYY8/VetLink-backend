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
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "La fecha es obligatoria" });
    }

    const blocks = await as.getVetAvailability(
      vetId,
      date
    );

    res.status(201).json({
      message: "Disponibilidad generada",
      data: blocks,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

  // CREAR TURNOOOOOOOOOOOOO
export const createAppointmentController = async (req, res) => {
  try {
    const ownerId =
      req.user.role === "OWNER"
        ? req.user.id        // si el owner saca el turno, su id viene del token
        : req.body.ownerId;  // si no, se pide en el body del request

    const appointment = await as.createAppointment({
      ...req.body,
      ownerId,
    });

    res.status(201).json({
      message: "Turno reservado con éxito",
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const result = await as.cancelAppointment(
      appointmentId,
      userId,
      role
    );

    res.json({
      message: "Turno cancelado correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

  // VER AGENDA DEL VETERINARIO
export const getVetAgendaController = async (req, res) => {
  try{
    const vetId = req.user.id; // extraer del token el id del vet
    console.log("vetId: " + vetId)
          // const { date } = req.query; // para filtrar por fecha   edit: Ya no filtramos por 1 sola fecha
    const { from, to, status } = req.query; // ahora necesitamos pasar a estas variables: desde esta fecha, hasta esta fecha, status del turno
    console.log("From2: " + from)
    console.log("To2: " + to)
    console.log("Status2: " + status)
    const agenda = await as.getVetAgenda({
      vetId,
      from,
      to,
      status,
    });
    console.log("Agenda2: " + agenda)

    res.status(200).json({
      message: "Agenda del veterinario",
      data: agenda,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
};

export const getVetDailyAgendaController = async (req, res) => {
  try{
    const vetId = req.user.id;
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const agenda = await as.getVetAgenda({
      vetId,
      from: today,
      to: tomorrow,
      status: "SCHEDULED",
    });

    res.status(200).json({
      message: "Agenda del día",
      data: agenda
    });

  }catch(error){
    res.status(400).json({ message: error.message });
  }
};


