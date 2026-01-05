import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim: true,
    },
    lastName:{
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
    role: {
      type: String,
      enum: ["OWNER", "SECRETARY", "ADMIN"],
      default: "OWNER",
    },
  },
  { timestamps: true }
);

const Usuario = mongoose.model("User", userSchema)

export default Usuario