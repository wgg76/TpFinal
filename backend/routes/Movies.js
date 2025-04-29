// src/routes/Movies.js

import express from "express";
import Movie from "../models/Movie.js";
import fetch from "node-fetch"; // Node ≥ 18 ya tiene fetch; quítalo si te sobra
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const OMDB_API_KEY = process.env.OMDB_API_KEY || "55d5dfd9";
const moviesRouter = express.Router();

/* -------------------------------------------------------
   🔧 Consulta OMDb y guarda/actualiza el documento
   ----------------------------------------------------- */
async function fetchFromOMDbAndSave(imdbID, { overwrite = false } = {}) {
  if (!OMDB_API_KEY) throw new Error("Falta OMDB_API_KEY");

  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}&plot=full`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === "False") throw new Error(`OMDb: ${data.Error}`);

  const yearNum       = parseInt(data.Year, 10);
  const imdbRatingNum = parseFloat(data.imdbRating);
  const metascoreNum  = parseInt(data.Metascore, 10);

  const payload = {
    imdbID: data.imdbID,
    ...( !isNaN(yearNum)       && { Year:       yearNum } ),
    ...( !isNaN(imdbRatingNum) && { imdbRating: imdbRatingNum } ),
    ...( data.imdbVotes        && { imdbVotes:  data.imdbVotes } ),
    ...( !isNaN(metascoreNum)  && { Metascore:  metascoreNum } ),
    Type:    data.Type,
    Poster:  data.Poster,
    Rated:   data.Rated,
    Plot:    data.Plot,
    Ratings: data.Ratings,
    Runtime: data.Runtime,
  };

  const saved = await Movie.findOneAndUpdate(
    { imdbID },
    overwrite ? payload : { $setOnInsert: payload },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return saved;
}

/* ==================== LISTADO CON FILTROS ==================== */
moviesRouter.get("/", requireAuth, async (req, res) => {
  try {
    const page       = parseInt(req.query.page, 10)  || 1;
    const limit      = parseInt(req.query.limit, 10) || 20;
    const type       = req.query.type;
    const minRating  = req.query.minRating;
    const yearFrom   = req.query.yearFrom;
    const yearTo     = req.query.yearTo;

    const query = {};
    if (type)       query.Type       = type;
    if (minRating)  query.imdbRating = { $gte: parseFloat(minRating) };
    if (yearFrom || yearTo) {
      query.Year = {};
      if (yearFrom) query.Year.$gte = parseInt(yearFrom, 10);
      if (yearTo)   query.Year.$lte = parseInt(yearTo, 10);
    }

    const skip = (page - 1) * limit;
    const [movies, total] = await Promise.all([
      Movie.find(query)
        .sort({ Metascore: -1 })
        .skip(skip)
        .limit(limit),
      Movie.countDocuments(query),
    ]);

    return res.json({ movies, total });
  } catch (err) {
    console.error("Error al listar películas:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ==================== TOP RATING ==================== */
moviesRouter.get("/rating", async (req, res) => {
  try {
    const top = await Movie.find()
      .sort({ Metascore: -1 })
      .limit(20);
    res.json(top);
  } catch (err) {
    console.error("Error en GET /api/movies/rating:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ==================== TOP IMDB ==================== */
moviesRouter.get("/top-imdb", async (req, res) => {
  try {
    const top = await Movie.find()
      .sort({ imdbRating: -1 })
      .limit(10);
    res.json(top);
  } catch (err) {
    console.error("Error en GET /api/movies/top-imdb:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ==================== BUSCAR POR IMDB ID ==================== */
moviesRouter.get("/imdb/:imdbID", async (req, res) => {
  try {
    const movie = await Movie.findOne({ imdbID: req.params.imdbID });
    if (!movie) return res.status(404).json({ error: "No existe" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==================== DETALLE POR ID ==================== */
moviesRouter.get("/:id", async (req, res) => {
  try {
    // Incrementa sólo si no pedimos skipCount
    const shouldCount = req.query.skipCount !== "true";
    let movie;
    if (shouldCount) {
      movie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
      );
    } else {
      movie = await Movie.findById(req.params.id);
    }

    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    const forceRefresh = req.query.refresh === "true";
    if (forceRefresh || !movie.Ratings?.length) {
      try {
        movie = await fetchFromOMDbAndSave(movie.imdbID, { overwrite: forceRefresh });
      } catch (omdbErr) {
        console.error("❌ OMDb refresh failed, returning stored document:", omdbErr);
      }
    }

    res.json(movie);
  } catch (err) {
    console.error("❌ Error en GET /api/movies/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========== RUTAS DE MODIFICACIÓN (ADMIN) ========== */
moviesRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const movie = new Movie(req.body);
      await movie.save();
      res.status(201).json(movie);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

moviesRouter.put(
  "/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ error: "Película no encontrada" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

moviesRouter.put(
  "/imdb/:imdbID",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const updated = await Movie.findOneAndUpdate(
        { imdbID: req.params.imdbID },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: "Película no encontrada" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

moviesRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const removed = await Movie.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ error: "Película no encontrada" });
      res.json({ message: "Película eliminada" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default moviesRouter;
