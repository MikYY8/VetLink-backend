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
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    vaccineName: {
        type: String,
        required: true
    },
    appliedDate: {
        type: Date,
        required: true,
    },
    notes: {
        type: String
    }
  },
  { timestamps: true }
);

const Vacuna = mongoose.model("Vaccine", vaccineSchema)

export default Vacuna