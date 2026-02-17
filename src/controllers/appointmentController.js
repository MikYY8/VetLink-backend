import { appointmentService } from "../services/appointmentService.js"
import { dogVaccines, catVaccines } from "../utils/vaccineCatalog.js";

const as = new appointmentService();

    // OBTENER TURNOS DISPONIBLES (NO crea, solo MUESTRA)
export const getAvailableAppointmentsController = async (req, res) => {
  try{
    const { date, specialty, vetId } = req.query;
    const available = await as.getAvailableAppointments({date, specialty, vetId});

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
  try{
    const { vetId } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "La fecha es obligatoria" });
    }

    const blocks = await as.getVetAvailability(vetId, date);

    res.status(201).json({
      message: "Disponibilidad generada",
      data: blocks,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
};

  // CREAR TURNO pueden hacerlo owners, secres, admins
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

  // VER AGENDA DEL VETERINARIO con filtros por estado y fecha
export const getVetAgendaController = async (req, res) => {
  try{
    const vetId = req.user.id; // extraer del token el id del vet
    const { from, to, status } = req.query; // pasamos estas variables: desde esta fecha, hasta esta fecha, status del turno

    const agenda = await as.getVetAgenda({ vetId, from, to, status, });

    res.status(200).json({
      message: "Agenda del veterinario",
      data: agenda,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
};

  // OBETENER AGENDA DIARIA DEL VET más compacta, solo los de hoy y mañana
export const getVetDailyAgendaController = async (req, res) => {
  try{
    const vetId = req.user.id;   // id del token
    const today = new Date();    // trae la fecha de hoy
    today.setHours(0,0,0,0);     // la establece al primer segundo del dia
    const tomorrow = new Date(today);  // la fecha de mañana es hoy ...
    tomorrow.setDate(today.getDate() + 1);  // ... más uno, igual a mañana

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

  // MODIFICAR ESTADO DE TURNOS a COMPLETED (solo vets) o CANCELLED (owners, secres, admins)
export const updateAppointmentStatusController = async (req, res) => {
  try{ 
    const user = req.user;
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const updated = await as.updateAppointmentStatus(appointmentId, status, notes, user);

    res.status(200).json({
      message: "Estado del turno actualizado",
      data: updated,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
};

  // DASHBOARD DE SECRETARIA con todos los turnos
export const getDashboardController = async (req, res) => {

  try{
    const { date, from, to, vetId, status } = req.query;

    const dashboard = await as.getDashboard({ date, from, to, vetId, status });

    res.status(200).json({
      message: "Dashboard de turnos",
      data: dashboard,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
};

  // OBTENER TURNOS DEL OWNER (con filtro de estado, lo ideal seria solo traer los SCHEDULED y luego hacer un historial para los COMPLETED/CANCELLED)
export const getOwnerAppointmentsController = async (req, res) => {
  try{
    const ownerId = req.user.id; 
    let { status } = req.query;

    if (!status) status = "SCHEDULED";

    const appointments = await as.getOwnerAppointments({ ownerId, status });

    res.status(200).json({
      message: "Mis turnos",
      data: appointments,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
};

  // OBTENER HISTORIAL DE TURNOS DEL OWNER (Turnos con status COMPLETED y CANCELLED)
export const getAppointmentsHistoryController = async (req, res) => {
  try{
    const ownerId = req.user.id; 
    let { status } = req.query;

    const history = await as.getAppointmentsHistory({ ownerId, status });

    res.status(200).json({
      message: "Turnos pasados",
      data: history,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
};

export const getVetsByAppointmentTypeController = async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {};

    if (type === "CONSULTATION") {
      filter.specialty = "GENERAL";
    }

    if (type === "SURGERY") {
      filter.specialty = "SURGERY";
    }

    if (type === "CONTROL" || type === "VACCINATION") {
      filter.specialty = { $ne: "SURGERY" };
    }

    const vets = await Veterinario.find(filter);

    res.status(200).json({ data: vets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVaccinesBySpeciesController = (req, res) => {
    const { species } = req.query;

    if (species === "DOG") return res.json({ data: dogVaccines });
    if (species === "CAT") return res.json({ data: catVaccines });

    res.status(400).json({ message: "Especie inválida" });
};
