import { getVetAvailability } from "../services/availabilityService.js";
import Vet from "../models/vetModel.js";

// const vs = new vetService();

    // VER PERFIL DEL VETERINARIO
export const getVetProfile = async (req, res) => {
  try{
    const vetId = req.user.id;
    const vet = await Vet.findById(vetId).select("-password");
    if (!vet) {
      return res.status(404).json({ message: "Veterinario no encontrado" });
    }

    res.status(200).json({
      message: "Perfil del veterinario",
      data: vet,
    });
  }catch(error) {
    res.status(500).json({ message: error.message });
  }
};

    // ACTUALIZAR DATOS DEL VETERINARIO
export const updateVetProfile = async (req, res) => {
    try{
        const vetId = req.user.id;
        const allowedFields = [
            "specialty",
            "acceptsConsultations",
            "phone",
            "photoUrl",
            "workSchedule",
        ];
        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedVet = await Vet.findByIdAndUpdate(
            vetId,
            updates,
            { new: true, runValidators: true }
        ).select("-password");
        if (!updatedVet) {
            return res.status(404).json({ message: "Veterinario no encontrado" });
        }

        res.status(200).json({
            message: "Perfil actualizado",
            data: updatedVet,
        });
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
};

    // TURNOS DEL VETERINARIO (AGENDA)
export const getVetAgenda = async (req, res) => {
    try{
        const { id } = req.params;
        const { date } = req.query;

        const availableSlots = await getVetAvailability(id, date);

        res.status(200).json({
            vetId: id,
            date,
            availableSlots,
        });
    }catch (error){
        res.status(400).json({ message: error.message });
    }
};
