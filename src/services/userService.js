import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import Usuario from "../models/userModel.js"
import Veterinario from "../models/vetModel.js";

export class userService {
    async registerUser (firstName, lastName, email, password, role) {
        const existingUser = await Usuario.findOne({ email });
        if(existingUser){
            throw new Error("E-mail ya registrado");
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Usuario.create({firstName, lastName, email, password : hashedPassword, role});
        return newUser;
    };

    async registerVet (firstName, lastName, email, password, licenseNumber, specialty, workSchedule, acceptsConsultations){
        const existingVet = await Veterinario.findOne({ email });
        if(existingVet){
            throw new Error("E-mail ya registrado");
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVet = await Veterinario.create({ firstName, lastName, email, password : hashedPassword, licenseNumber, specialty, workSchedule, acceptsConsultations })
        return newVet;
    };

    async loginUser (email, password) {
        try{
            const userExists = await Usuario.findOne({ email });
            if (!userExists) {
                throw new Error("Email o contraseña incorrectos");
            };
            const passwordValid = await bcrypt.compare(password, userExists.password);
            if (!passwordValid) {
                throw new Error("Email o contraseña incorrectos");
            };
            const accesstoken = generateAccessToken({
                id: userExists._id,
                email: userExists.email,
                role: userExists.role,
            });
            const refreshtoken = generateRefreshToken({
                id: userExists._id,
                email: userExists.email,
                role: userExists.role,
            });
            return { accesstoken, refreshtoken };

        }catch(error) {
            throw new Error(error);
        };
    };

    async loginVet (email, password) {
        try{
            const vetExists = await Veterinario.findOne({ email });
            if (!vetExists) {
                throw new Error("Email o contraseña incorrectos");
            };

            const passwordValid = await bcrypt.compare(password, vetExists.password);
            if (!passwordValid) {
                throw new Error("Email o contraseña incorrectos");
            };

            const accesstoken = generateAccessToken({
                id: vetExists._id,
                email: vetExists.email,
                role: vetExists.role,
            });
            const refreshtoken = generateRefreshToken({
                id: vetExists._id,
                email: vetExists.email,
                role: vetExists.role,
            });
            return { accesstoken, refreshtoken };

        }catch(error) {
            throw new Error(error);
        };
    };

    async renovateAccessToken(refreshtoken) {
        const payload = jwt.verify(refreshtoken, process.env.JWT_REFRESH);
        const user = await Usuario.findById(payload.id);
        if (!user) {
            throw new Error("No se encontró el usuario");
        };
        const accesstoken = generateAccessToken({id: user._id, email: user.email, role: user.role,});
        return accesstoken
    };  

        // EDITAR DATOS DE UN USUARIO
    async updateUser(ownerId, updateData) {
        const user = await Usuario.findById(ownerId);

        if (!user) {
            throw new Error("Usuario no encontrado");
        };

        Object.assign(user, updateData);
        await user.save();
        return user;
    };

        // EDITAR DATOS DE UN VETERINARIO
    async updateVet(vetId, updateData) {
        const vet = await Veterinario.findById(vetId);

        if (!vet) {
            throw new Error("Veterinario no encontrado");
        };

        Object.assign(vet, updateData);
        await vet.save();
        return vet;
    };

};
