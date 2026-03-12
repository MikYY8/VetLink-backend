import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    birthDate: {
    type: Date,
    required: true,
    },

    isEstimated: {
    type: Boolean,
    default: false,
    },
    sex:{
        type:String,
        enum: ["M","F"],
        required: true,
    },
    species: {
        type: String,
        enum: ["DOG","CAT"],
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    isNeutered: {
        type: Boolean,
        required: true,
    },
    photoUrl: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
  },
  { timestamps: true }
);

const Mascota = mongoose.model("Pet", petSchema)

export default Mascota