// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user"  // Por defecto, los usuarios se registran con rol "user"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
