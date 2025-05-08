// src/models/Profile.js
import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

const { Schema } = mongoose;

const profileSchema = new Schema({
  // Identificador público corto y legible
  publicId: {
    type: String,
    unique: true,
    default: () => nanoid(),
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: date => date <= Date.now(),
      message: "La fecha de nacimiento no puede ser futura"
    }
  },
  age: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["child", "standard"],
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  watchlist: {
    type: [String],
    default: []
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true }
});

// Hook: antes de validar (pre-validate) recalculamos edad y tipo si cambia dob
profileSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();

  if (update.dob) {
    const birth = new Date(update.dob);
    const diffMs = Date.now() - birth.getTime();
    const age = Math.abs(new Date(diffMs).getUTCFullYear() - 1970);
    const type = age < 13 ? "child" : "standard";

    this.setUpdate({
      ...update,
      age,
      type
    });
  }
  next();
});

export default mongoose.model("Profile", profileSchema);
