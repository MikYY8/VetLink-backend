import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import Mascota from "../models/petModel.js"

export class petService {

    async getPetDetails(petId){
        const pet = Mascota.findById(petId)
        .populate("owner", "firstName lastName email")

        if (!pet) throw new Error("Mascota no encontrada");
        
        return pet;
    };
    
        // CREAR MASCOTA
    async createPet(petData, ownerId, photoUrl) {
        const newPet = await Mascota.create({
            ...petData,
            owner: ownerId,
            photoUrl
        });
        return newPet;
    };

        // EDITAR MASCOTA
    async updatePet(petId, updateData, user) {
        const pet = await Mascota.findById(petId);

        if (!pet) throw new Error("Mascota no encontrada");

    // Si es OWNER, solo puede editar sus mascotas
        if (user.role === "OWNER" && pet.owner.toString() !== user.id) {
            throw new Error("No tenés permiso para editar esta mascota");
        };

        Object.assign(pet, updateData);
        await pet.save();
        return pet;
    };

        // ELIMINAR MASCOTA
    async deletePet(petId, user) {
        const pet = await Mascota.findById(petId);

        if (!pet) throw new Error("Mascota no encontrada");

        if (user.role === "OWNER" && pet.owner.toString() !== user.id) {
            throw new Error("No tenés permiso para eliminar esta mascota");
        };

        await pet.deleteOne();
    };
};