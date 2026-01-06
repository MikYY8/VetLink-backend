import { check } from "express-validator";

// VALIDACIÓN DE REGISTRO
export const registerValidation = [
    check("firstName")
        .isString().withMessage("El nombre debe ser un String")
        .notEmpty().withMessage("El nombre es obligatorio"),
    check("lastName")
        .isString().withMessage("El apellido debe ser un String")
        .notEmpty().withMessage("El apellido es obligatorio"),
    check("email")
        .isEmail().withMessage("Email inválido")
        .notEmpty().withMessage("El email es obligatorio"),
    check("password")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
        .notEmpty().withMessage("La contraseña es obligatoria"),
];

// VALIDACIÓN DE LOGIN
export const loginValidation = [
    check("email")
        .isEmail().withMessage("Email o contraseña incorrectos")
        .notEmpty().withMessage("Email o contraseña incorrectos"),
    check("password")
        .notEmpty().withMessage("Email o contraseña incorrectos"),
];
