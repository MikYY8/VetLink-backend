import mongoose from "mongoose";

const availabilityBlockSchema = new mongoose.Schema(
  {
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
    reason: {
      type: String,
      default: "Bloqueado",
    },
  },
  { timestamps: true }
);

const BloqueDisponible = mongoose.model("AvailabilityBlock", availabilityBlockSchema)

export default BloqueDisponible
