import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import Usuario from "../models/userModel.js"
import Vet from "../models/vetModel.js";

export class userService {
    async registerUser (firstName, lastName, email, password) {
        const existingUser = await Usuario.findOne({ email });
        if(existingUser){
            throw new Error("E-mail ya registrado");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Usuario.create({firstName, lastName, email, password : hashedPassword});
        return newUser;
    };

    async registerVet (firstName, lastName, email, password, licenseNumber, specialty, workSchedule, acceptsConsultations){
        const existingVet = await Vet.findOne({ email });
        if(existingVet){
            throw new Error("E-mail ya registrado");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVet = await Vet.create({ firstName, lastName, email, password : hashedPassword, licenseNumber, specialty, workSchedule, acceptsConsultations })
        return newVet;
    }

    async loginUser (email, password) {
        try{
            const userExists = await Usuario.findOne({ email });
            if (!userExists) {
                throw new Error("Email o contraseña incorrectos");
            }
            const passwordValid = await bcrypt.compare(password, userExists.password);
            if (!passwordValid) {
                throw new Error("Email o contraseña incorrectos");
            }
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
        }
    };

    async loginVet (email, password) {
        try{
            const vetExists = await Vet.findOne({ email });
            if (!vetExists) {
                throw new Error("Email o contraseña incorrectos");
            }

            const passwordValid = await bcrypt.compare(password, vetExists.password);
            if (!passwordValid) {
                throw new Error("Email o contraseña incorrectos");
            }

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
        }
    };

    async renovateAccessToken(refreshtoken) {
        const payload = jwt.verify(refreshtoken, process.env.JWT_REFRESH);
        const user = await Usuario.findById(payload.id);
        if (!user) {
            throw new Error("No se encontró el usuario");
        }
        const accesstoken = generateAccessToken({id: user._id, email: user.email, role: user.role,});
        return accesstoken
    }

}