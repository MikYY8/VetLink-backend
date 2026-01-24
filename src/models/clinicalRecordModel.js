import mongoose from "mongoose";

const clinicalRecordSchema = new mongoose.Schema({
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
    reason: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    treatment: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

const HistorialClinico = mongoose.model("ClinicalRecord", clinicalRecordSchema)

export default HistorialClinico