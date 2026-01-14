import { userService } from "../services/userService.js"
import Usuario from "../models/userModel.js"
import Veterinario from "../models/vetModel.js";

const us = new userService();

    // REGISTRO DE USUARIOS (SECRETARY, ADMIN)
export const registerUserController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body; 
    const newUser = await us.registerUser(firstName, lastName, email, password, role);

    res.status(201).json({
      message: "Success",
      code: 201,
      data: newUser,
    });
    }catch(error){
        res.status(400).json({ message: error.message });
    };
};

    // REGISTRO DE VETERINARIOS (SECRETARY, ADMIN)
export const registerVetController = async (req, res) => {
    try{
        const { firstName, lastName, email, password, licenseNumber, specialty, workSchedule, acceptsConsultations } = req.body;
        const newVet = await us.registerVet(firstName, lastName, email, password, licenseNumber, specialty, workSchedule, acceptsConsultations);
        
        res.status(201).json({
          message: "Success",
          code: 201,
          data: newVet,
        });
    }catch (error) {
        res.status(400).json({ message: error.message });
    };
};

    // LOGIN DE USUARIOS (OWNER, SECRETARY, ADMIN)
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accesstoken, refreshtoken } = await us.login(email, password);
        res.set({
            Authorization: `Bearer ${accesstoken}`,
            "x-refresh-token": refreshtoken,
        });
        res.status(200).json({
            mensage: "success",
            code: 200,
            data: { accesstoken, refreshtoken },
        });
    } catch (error) {
        res.status(401).json(error.message);
    }
};

    // RENOVAR TOKEN DE LOGIN (TODOS)
export const renovateTokenController = async (req, res) => {
    try {
        const refreshtoken = req.headers["x-refresh-token"];
        const accesstoken = await us.renovateAccessToken(refreshtoken);
        res.set({
            "Authorization": `Bearer ${accesstoken}`,
            "x-refresh-token": refreshtoken,
        });
        res.status(200).json({
            mensage: "success",
            code: 200,
            data: { accesstoken, refreshtoken },
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

    // OBTENER TODOS LOS USUARIOS (SECRETARY, ADMIN)
export const getAllUsersController = async (req, res) => {
    try{
        const users = await Usuario.find()
        res.status(200).json({
            mensage: "success",
            code: 200,
            data: users
        });
    }catch(error){
        res.status(500).json(error.message);
    }
};

    // OBTENER TODOS LOS VETERINARIOS (SECRETARY, ADMIN)
export const getAllVetsController = async (req, res) => {
    try{
        const vets = await Veterinario.find()
        res.status(200).json({
            mensage: "success",
            code: 200,
            data: vets
        });
    }catch(error){
        res.status(500).json(error.message);
    }
};

    // EDITAR USUARIO (SECRETARY, ADMIN)
export const updateUserController = async (req, res) => {
    try{
        const { ownerId } = req.params;
        const user = await Usuario.find({ownerId})
        const updateData = req.body;

        const updatedUser = await us.updateUser(ownerId, updateData, user); 
        res.status(200).json({
            mensage: "success",
            code: 200,
            data: updatedUser
        });
    }catch(error){
        res.status(500).json(error.message);
    };
};

    // ELIMINAR USUARIO (SECRETARY, ADMIN)
export const deleteUserController = async (req, res) => {
  try {
    const { ownerId } = req.params; 
    const user = await Usuario.findById(ownerId);
    await user.deleteOne();

    res.status(200).json({
      message: "Usuario eliminado",
    });
    }catch(error){
        res.status(403).json({ message: error.message });
    };
};

    // EDITAR VETERINARIO (SECRETARY, ADMIN)
    export const updateVetController = async (req, res) => {
    try{
        const { vetId } = req.params;
        console.log(vetId)
        const vet = await Veterinario.find({vetId})
        const updateData = req.body;

        const updatedVet = await us.updateVet(vetId, updateData, vet); 
        res.status(200).json({
            mensage: "success",
            code: 200,
            data: updatedVet
        });
    }catch(error){
        res.status(500).json(error.message);
    };
};

    // ELIMINAR VETERINARIO (SECRETARY, ADMIN)
export const deleteVetController = async (req, res) => {
  try {
    const { vetId } = req.params; 
    const vet = await Veterinario.findById(vetId);
    await vet.deleteOne();

    res.status(200).json({
      message: "Veterinario eliminado",
    });
    }catch(error){
        res.status(403).json({ message: error.message });
    };
};

