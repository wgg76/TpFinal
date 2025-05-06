// src/models/Profile.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const profileSchema = new Schema({
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
      message:  "La fecha de nacimiento no puede ser futura"
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
  }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true }
});

// Hook: antes de validar (pre-validate) calculamos edad y tipo
profileSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();

  // Solo si viene un nuevo dob, recalculamos
  if (update.dob) {
    const birth = new Date(update.dob);
    const diffMs = Date.now() - birth.getTime();
    const age = Math.abs(new Date(diffMs).getUTCFullYear() - 1970);
    const type = age < 13 ? "child" : "standard";

    // Inyectamos los campos al objeto de actualización
    this.setUpdate({
      ...update,
      age,
      type,
    });
  }
  next();
});

export default mongoose.model("Profile", profileSchema);
