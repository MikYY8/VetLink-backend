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
    startTime: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: ["CONSULTATION", "CONTROL", "VACCINATION"],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["SCHEDULED", "CANCELLED", "COMPLETED"],
        default: "SCHEDULED",
    },
  },
  { timestamps: true }
);

const Turno = mongoose.model("Appointment", appointmentSchema)

export default Turno