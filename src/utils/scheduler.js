import cron from "node-cron";
import Veterinario from "../models/vetModel.js";
import { appointmentService } from "../services/appointmentService.js"

const as = new appointmentService();

cron.schedule("0 0 * * 6", async () => {
  console.log("Generando disponibilidad semanal...");

  try {
    const vets = await Veterinario.find();

    const today = new Date();

    // Día actual (0=Domingo, 1=Lunes...)
    const day = today.getDay();

    // Calcular lunes de la próxima semana SIEMPRE
    const daysUntilNextMonday = (8 - day) % 7 || 7;

    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    for (let i = 0; i < 6; i++) { // Lunes a sábado
      const date = new Date(nextMonday);
      date.setDate(nextMonday.getDate() + i);

      const formattedDate = date.toISOString().split("T")[0];

      for (const vet of vets) {
        await as.getVetAvailability(vet._id, formattedDate);
      }
    }

    console.log("Disponibilidad generada correctamente.");
  } catch (error) {
    console.error("Error generando disponibilidad:", error);
  }
});
