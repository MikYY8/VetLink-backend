import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import Pet from "../models/petModel.js"

export class petService {
    
    async getPetsByOwner() {

    };

        // CREAR MASCOTA
    async createPet(name, age, sex, species, breed, color, isNeutered, photoUrl) {
        // y como hago para verificar si esta mascota ya esta registrada? 
        // No soy responsable de los errores de la capa 8 xD COMO VAS A AGREGAR A TU MASCOTA DOS VECES GGGGGGGGGGGGGGGGGGG
        const newPet = await Pet.create({name, age, sex, species, breed, color, isNeutered, photoUrl});
        return newPet;
    };


        // EDITAR MASCOTA
    async updatePet(petId, updateData, user) {
        const pet = await Pet.findById(petId);

        if (!pet) {
            throw new Error("Mascota no encontrada");
        };

    // Si es OWNER, solo puede editar sus mascotas
        if (user.role === "OWNER" && pet.owner.toString() !== user.id) {
            throw new Error("No tenés permiso para editar esta mascota");
        };

        Object.assign(pet, updateData);
        await pet.save();

        return pet;
    };

    async deletePet(petId, user) {
        const pet = await Pet.findById(petId);

        if (!pet) {
            throw new Error("Mascota no encontrada");
        };

        if (user.role === "OWNER" && pet.owner.toString() !== user.id) {
            throw new Error("No tenés permiso para eliminar esta mascota");
        };

        await pet.deleteOne();
    };





};