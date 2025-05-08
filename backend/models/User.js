// src/models/User.js
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => validator.isEmail(v),
      message: props => `${props.value} no es un email válido`
    }
  },
  password: { type: String, required: true },
  role:     { type: String, enum: ["admin","standard"], default: "standard" },
  // …
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
