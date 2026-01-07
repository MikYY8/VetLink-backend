import { userService } from "../services/userService.js"

const us = new userService();

export const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const newUser = await us.registerUser(firstName, lastName, email, password);

    res.status(201).json({
      message: "Success",
      code: 201,
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accesstoken, refreshtoken } = await us.loginUser(email, password);
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

export const loginVetController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accesstoken, refreshtoken } = await us.loginVet(email, password);
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