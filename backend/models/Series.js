import mongoose from "mongoose";
const { Schema } = mongoose;

const seriesSchema = new Schema({
  _id:        { type: String, required: true },  // usarás el mismo imdbID: "tt1234567"
  Poster:     String,
  Title:      String,
  Year:       String,
  imdbRating: Number,
  imdbVotes:  Number,
  views:      { type: Number, default: 0 },
}, {
  timestamps: true,
  _id:        false,  // ya definimos manualmente _id
  toJSON:   { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.model("Series", seriesSchema);
