import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
        unique: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
    },
    vet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vet",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    medication: {
        name: { type: String, required: true },
        dose: { type: String, required: true },
        frequency: { type: String, required: true }
    },
    notes: {
        type: String
    }
  },
  { timestamps: true }
);

const Receta = mongoose.model("Prescription", prescriptionSchema)

export default Receta