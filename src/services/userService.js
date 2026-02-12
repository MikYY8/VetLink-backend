import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import Usuario from "../models/userModel.js"
import Veterinario from "../models/vetModel.js";

export class userService {

        // REGISTRAR USUARIO 
    async registerUser (firstName, lastName, email, password, role) {
        const existingUser = await Usuario.findOne({ email });
        if(existingUser){
            throw new Error("E-mail ya registrado");
        };

        const newUser = await Usuario.create({firstName, lastName, email, password, role});
        return newUser;
    };

        // REGISTRAR VETERINARIO
    async registerVet (firstName, lastName, email, password, licenseNumber, specialty, acceptsConsultations, phone, workSchedule, photoUrl){
        const existingVet = await Veterinario.findOne({ email });
        if(existingVet){
            throw new Error("E-mail ya registrado");
        };

        const newVet = await Veterinario.create({ firstName, lastName, email, password, licenseNumber, specialty, acceptsConsultations, phone, workSchedule, photoUrl })
        
        return newVet;
    };

        // INICIAR SESIÓN 
    async login (email, password) {
        try{
            let account = await Usuario.findOne({ email });
            if (!account) {
                account = await Veterinario.findOne({ email });
            };
            if (!account) {
                throw new Error("Email o contraseña incorrectos");
            };
            const passwordValid = await bcrypt.compare(password, account.password);
            if (!passwordValid) {
                throw new Error("Email o contraseña incorrectos");
            };
            const accesstoken = generateAccessToken({
                id: account._id,
                email: account.email,
                role: account.role
            });
            const refreshtoken = generateRefreshToken({
                id: account._id,
                email: account.email,
                role: account.role,
            });

            return { accesstoken, refreshtoken };
        }catch(error) {
            throw new Error(error);
        };
    };

        // RENOVAR TOKEN
    async renovateAccessToken(refreshtoken) {
        try{
            const payload = jwt.verify(refreshtoken, process.env.JWT_REFRESH);
            const user = await Usuario.findById(payload.id);
            if (!user) {
                throw new Error("No se encontró el usuario");
            };
            const accesstoken = generateAccessToken({id: user._id, email: user.email, role: user.role,});
           
            return accesstoken
        }catch(error) {
            throw new Error(error);
        };
    };  

    async getAllOwners(query) {
        const owners = await Usuario.find({
            role: "OWNER",
            $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } }
            ]
        })
            .select("_id firstName lastName email")
            .limit(10);

        return owners;
    };


        // EDITAR DATOS DE UN USUARIO
    async updateUser(ownerId, updateData) {
        try{
            const user = await Usuario.findById(ownerId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            };

            Object.assign(user, updateData);
            await user.save();
            
            return user;
        }catch(error) {
            throw new Error(error);
        };
    };

        // EDITAR DATOS DE UN VETERINARIO
    async updateVet(vetId, updateData) {
        try{  
            const vet = await Veterinario.findById(vetId);
            if (!vet) {
                throw new Error("Veterinario no encontrado");
            };

            Object.assign(vet, updateData);
            await vet.save();
            
            return vet;
        }catch(error) {
            throw new Error(error);
        };
    };

};
