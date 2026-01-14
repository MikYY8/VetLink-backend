import mongoose from "mongoose";
import bcrypt from "bcrypt";

const vetSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        trim: true,
    },
    lastName: {
        type:String,
        required:true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type:String,
        required:true,
        trim: true,
    },
    specialty: {
        type: String,
        enum: [
            "GENERAL",
            "SURGERY",
            "DERMATOLOGY",
            "CARDIOLOGY",
            "TRAUMATOLOGY",
        ],
        required: true,
    },
    acceptsConsultations: {
        type: Boolean,
        required: true,
    },
    phone: {
        type:String,
    },
    photoUrl: {
        type: String,
    },
    workSchedule: {
        start: { type: String }, // "09:00"
        end: { type: String },   // "17:00"
    },
    role: {
      type: String,
      enum: ["VET"],
      default: "VET",
    },
  },
  { timestamps: true }
);

vetSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const Veterinario = mongoose.model("Vet", vetSchema)

export default Veterinario