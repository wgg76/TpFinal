// src/routes/tmdb.js
import express from "express";
import fetch from "node-fetch"; // si usas Node ≥18 puedes usar global.fetch
const router = express.Router();

const TMDB_KEY = process.env.VITE_TMDB_API_KEY; // o TMDB_API_KEY
const TMDB_BASE = "https://api.themoviedb.org/3";

// /api/tmdb/discover/movie?api_key=...&page=1
router.get("/discover/movie", async (req, res) => {
  try {
    const qs = new URLSearchParams({ api_key: TMDB_KEY, ...req.query });
    const resp = await fetch(`${TMDB_BASE}/discover/movie?${qs}`);
    const json = await resp.json();
    res.json(json);
  } catch (err) {
    console.error("TMDB /discover/movie error", err);
    res.status(500).json({ error: err.message });
  }
});

// /api/tmdb/discover/tv?api_key=...&page=1
router.get("/discover/tv", async (req, res) => {
  try {
    const qs = new URLSearchParams({ api_key: TMDB_KEY, ...req.query });
    const resp = await fetch(`${TMDB_BASE}/discover/tv?${qs}`);
    const json = await resp.json();
    res.json(json);
  } catch (err) {
    console.error("TMDB /discover/tv error", err);
    res.status(500).json({ error: err.message });
  }
});

// /api/tmdb/movie/:id/videos
router.get("/movie/:id/videos", async (req, res) => {
  try {
    const resp = await fetch(
      `${TMDB_BASE}/movie/${req.params.id}/videos?api_key=${TMDB_KEY}`
    );
    const json = await resp.json();
    res.json(json);
  } catch (err) {
    console.error("TMDB /movie/:id/videos error", err);
    res.status(500).json({ error: err.message });
  }
});

// /api/tmdb/tv/:id/videos
router.get("/tv/:id/videos", async (req, res) => {
  try {
    const resp = await fetch(
      `${TMDB_BASE}/tv/${req.params.id}/videos?api_key=${TMDB_KEY}`
    );
    const json = await resp.json();
    res.json(json);
  } catch (err) {
    console.error("TMDB /tv/:id/videos error", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
