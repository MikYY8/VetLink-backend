import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { Usuario } from "..model/userModel.js";

export class userService {
    async registerUser (firstName, lastName, email, password) {
        try{
            const existingUser = await Usuario.findOne({ email });
            if(existingUser){
                return res.status(400).json({ message: "E-mail ya registrado" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await Usuario.create({firstName, lastName, email, password: hashedPassword});
            res.status(201).json({ message: "Usuario creado con éxito" });
            return newUser;
        }catch(error) {
            res.status(500).json({ message: error.message });
        }
    };

    async loginUser (email, password) {
        const userExists = await Usuario.findOne({ email });
        if (!userExists) {
            return res.status(401).json({ message: "Email o contraseña incorrectos" });
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({ message: "Email o contraseña incorrectos" });
        }
        const accesstoken = generateAccessToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        const refreshtoken = generateRefreshToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        return { accesstoken, refreshtoken };
    };

    async renovateAccessToken(refreshtoken) {
        const payload = jwt.verify(refreshtoken, process.env.JWT_REFRESH);
        const user = await Usuario.findById(payload.id);
        if (!user) {
            return res.status(401).json({ message: "No se encontró el usuario" });
        }
        const accesstoken = generarAccessToken({id: user._id, email: user.email, role: user.role,});
        return accesstoken
    }

}