import Veterinario from "../models/vetModel.js";

// const vs = new vetService();

    // VER PERFIL DEL VETERINARIO
export const getVetProfile = async (req, res) => {
  try{
    const vetId = req.user.id;
    const vet = await Veterinario.findById(vetId).select("-password");
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
            // "acceptsConsultations",
            // "phone",
            // "photoUrl",
            "workSchedule",
        ];
        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedVet = await Veterinario.findByIdAndUpdate(
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

