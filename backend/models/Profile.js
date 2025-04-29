import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob:  { type: Date,   required: true },
  age:  { type: Number, required: true },
  type: { type: String, enum: ["owner","standard","child"], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  watchlist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Movie",
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model("Profile", ProfileSchema);

