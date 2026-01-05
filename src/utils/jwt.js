import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const JWT_ACCESS = process.env.JWT_ACCESS
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN
const JWT_REFRESH = process.env.JWT_REFRESH
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN

export const generateAccessToken = (payload)=>{
    const expiresIn = JWT_ACCESS_EXPIRES_IN
    return jwt.sign(payload,JWT_ACCESS,{expiresIn})
}

export const generateRefreshToken = (payload)=>{
    const expiresIn = JWT_REFRESH_EXPIRES_IN
    return jwt.sign(payload,JWT_REFRESH,{expiresIn})
}