import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
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
        name: { type: String },
        dose: { type: String }, 
        frequency: { type: String }, 
    },
    notes: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

const Receta = mongoose.model("Prescription", prescriptionSchema)

export default Receta