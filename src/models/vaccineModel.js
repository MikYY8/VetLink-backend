import mongoose from "mongoose";

const vaccineSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required: true
    },
    nextDose: {
        type: Date,
        required: true
    },
  },
  { timestamps: true }
);

const Vacuna = mongoose.model("Vaccine", vaccineSchema)

export default Vacuna