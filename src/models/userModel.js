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

userSchema.pre("save", async function (next) {
  // this === el documento (usuario)
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Usuario = mongoose.model("User", userSchema)

export default Usuario