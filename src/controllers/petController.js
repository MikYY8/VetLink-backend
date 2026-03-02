import { petService } from "../services/petService.js"
import Mascota from "../models/petModel.js"

const ps = new petService();

    // OBTENER TODAS LAS MASCOTAS (SECRETARY, ADMIN)
export const getAllPetsController = async (req, res) => {
    try{
        const pets = await Mascota.find().populate("owner", "firstName lastName");
        res.status(200).json({
            message: "success",
            code: 200,
            data: pets
        });
    }catch(error){
        res.status(500).json(error.message);
    }
};

    // VER TODAS LAS MASCOTAS del owner
export const getAllOwnerPetsController = async (req, res) => {
  try {
      const ownerId =
      req.user.role === "OWNER"
        ? req.user.id
        : req.body.ownerId;

    // const ownerId = req.params.ownerId;     // extraer del req los parametros 
    const pets = await Mascota.find({ owner : ownerId });  // busca owner por su Id

    res.status(200).json({
      message: "Mascotas obtenidas",
      data: pets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

    // VER DETALLES DE LA MASCOTA
export const getPetDetailsController = async (req, res) => {
  try{
    const { petId } = req.params;    // busco la id de la mascota
    const pet = await Mascota.findById(petId);  // pregunto a Mongo si encuentra los DATOS de un Pet con ese Id
    if (!pet) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    res.status(200).json({
      message: "Detalles de tu mascota",
      data: pet,
    });
  }catch(error) {
    res.status(500).json({ message: error.message });
  }
};

    // CREAR NUEVA MASCOTA
export const createPetController = async (req, res) => {

  try {
    const ownerId =
      req.user.role === "OWNER"
        ? req.user.id
        : req.body.owner;

    const petData = req.body;    // body del request, es decir, datos ingresados y procesados por el service

    const newPet = await ps.createPet(petData, ownerId);

    res.status(201).json({
      message: "Mascota creada con éxito",
      data: newPet,
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
};

    // EDITAR MASCOTA
export const updatePetController = async (req, res) => {
  try {
    const { petId } = req.params; 
    const user = req.user;
    const updateData = req.body;

    const updatedPet = await ps.updatePet(
      petId,
      updateData,
      user
    );

    res.status(200).json({
      message: "Mascota actualizada",
      data: updatedPet,
    });
  }catch(error){
    res.status(403).json({ message: error.message });
  }
};

    // ELIMINAR MASCOTA
export const deletePetController = async (req, res) => {
  try {
    const { petId } = req.params; 
    const user = req.user; 

    await ps.deletePet(petId, user);

    res.status(200).json({
      message: "Mascota eliminada",
    });
  }catch(error){
    res.status(403).json({ message: error.message });
  }
};
