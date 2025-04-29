// src/models/Movie.js
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  Title:      { type: String, required: true },
  Year:       Number,
  imdbID:     { type: String, unique: true },
  imdbRating: { type: Number },
  imdbVotes:  { type: String },
  Type:       String,
  Poster:     String,
  Rated:      String,
  Plot:       String,
  Runtime:    String,
  Metascore:  { type: Number },
  Ratings: [
    { Source: String, Value: String }
  ],
   // Contador de veces que se vio la película
   views:     { type: Number, default: 0 },
});

export default mongoose.model("Movie", movieSchema);
