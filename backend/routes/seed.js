// src/routes/seed.js
import express from "express";
import fetch from "node-fetch";
import Movie from "../models/Movie.js";
import Series from "../models/Series.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();
const TMDB_KEY  = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

async function fetchTMDB(path, query = {}) {
  const qs = new URLSearchParams({ api_key: TMDB_KEY, ...query });
  const res = await fetch(`${TMDB_BASE}${path}?${qs}`);
  const { results } = await res.json();
  return results;
}

// POST /api/seed
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    await Movie.deleteMany({});
    await Series.deleteMany({});

    const [movies, series] = await Promise.all([
      fetchTMDB("/discover/movie", { page: 1 }),
      fetchTMDB("/discover/tv",    { page: 1 }),
    ]);

    // Películas: usaremos imdb_id de TMDB
    await Promise.all(movies.slice(0, 20).map(async (m) => {
      // Opcional: pedir imdb_id real
      const info = await fetch(
        `${TMDB_BASE}/movie/${m.id}/external_ids?api_key=${TMDB_KEY}`
      ).then(r=>r.json());
      return Movie.create({
        _id:        info.imdb_id,            // ej. "tt0111161"
        Poster:     `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        Title:      m.title,
        Year:       (m.release_date||"").slice(0,4),
        imdbRating: m.vote_average,
        imdbVotes:  m.vote_count,
        views:      0,
      });
    }));

    // Series: igual, sacando imdb_id
    await Promise.all(series.slice(0, 20).map(async (s) => {
      const info = await fetch(
        `${TMDB_BASE}/tv/${s.id}/external_ids?api_key=${TMDB_KEY}`
      ).then(r=>r.json());
      return Series.create({
        _id:        info.imdb_id,            // ej. "tt0944947"
        Poster:     `https://image.tmdb.org/t/p/w500${s.poster_path}`,
        Title:      s.name,
        Year:       (s.first_air_date||"").slice(0,4),
        imdbRating: s.vote_average,
        imdbVotes:  s.vote_count,
        views:      0,
      });
    }));

    return res.json({ message: "🌱 Base recargada con imdbID unificado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
