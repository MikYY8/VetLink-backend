import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    time: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["CONSULTATION", "CONTROL", "VACCINATION"],
        required: true,
    },
    vaccineName: {
        type: String
    },
    details: {
        type: String
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "SCHEDULED", "CANCELLED", "COMPLETED"],
        default: "AVAILABLE",
    }
  },
  { timestamps: true }
);

const Turno = mongoose.model("Appointment", appointmentSchema)

export default Turno