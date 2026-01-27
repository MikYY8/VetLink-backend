import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import cors from "cors"

import userRouter from "./src/routes/userRoutes.js"
import vetRoutes from "./src/routes/vetRoutes.js";
import ownerRoutes from "./src/routes/ownerRoutes.js"
import appointmentRoutes from "./src/routes/appointmentRoutes.js"
import clinicalRecordRoutes from "./src/routes/clinicalRecordRoutes.js"

const app = express()
const PORT = process.env.PORT || 3000
// const JWT_ACCESS = process.env.JWT_ACCESS

const corsOptions = {  // origin: ["http://localhost:5173", "https://TU-FRONT.netlify.app"],
  "origin": ["http://localhost:3000"], // agregar "https://midominio.com.ar" cuando tengamos
  "methods": "GET,POST,PUT,DELETE",
  "allowedHeaders": ["Content-Type", "Authorization", "x-refresh-token"]
};

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Working on the Vet app');
});

app.use("/users", userRouter);
app.use("/vets", vetRoutes);
app.use("/owner", ownerRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/clinicalRecord", clinicalRecordRoutes);


mongoose.connect(process.env.MONGOURL).then(()=>{
  console.log("Base de datos conectada a " + process.env.MONGOURL)
}).catch((error)=>{
  console.log(error)
});

app.listen(PORT, () => {
  console.log(`Running in http://localhost:${PORT}`)
});

