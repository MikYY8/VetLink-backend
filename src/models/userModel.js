import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    dni:{
      type:Number,
      required:true,
      unique:true,
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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


const Usuario = mongoose.model("User", userSchema)

export default Usuario