import { validationResult } from "express-validator"

export const validationMiddleware = (req,res,next) => {
    const error = validationResult(req)
    if (!error.isEmpty()){
      return res.status(400).json({
            mensage: "Error: parámetros incorrectos",
            success: false,
            code: 400,
            data: error.array(),
        });
    }
    next()
}
