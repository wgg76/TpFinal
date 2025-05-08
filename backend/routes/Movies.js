<<<<<<< HEAD
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
=======
// src/routes/Movies.js
import express from "express";
import Movie from "../models/Movie.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

// ▶️ Debug: atrapa toda petición a /api/movies
router.use((req, res, next) => {
  next();
});

// LISTADO CON FILTROS
// GET /api/movies?page=1&limit=10&minRating=6&yearFrom=2000&yearTo=2023
router.get("/", requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const minRating = parseFloat(req.query.minRating);
    const yearFrom = parseInt(req.query.yearFrom, 10);
    const yearTo = parseInt(req.query.yearTo, 10);

    // Ya no filtramos por Type
    const query = {};

    if (!isNaN(minRating)) {
      query.imdbRating = { $gte: minRating };
    }
    if (!isNaN(yearFrom) || !isNaN(yearTo)) {
      query.Year = {};
      if (!isNaN(yearFrom)) query.Year.$gte = yearFrom;
      if (!isNaN(yearTo)) query.Year.$lte = yearTo;
    }

    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      Movie.find(query).sort({ imdbRating: -1 }).skip(skip).limit(limit),
      Movie.countDocuments(query),
    ]);

    return res.json({ movies: results, total });
  } catch (err) {
    console.error("Error GET /api/movies:", err);
    return res.status(500).json({ error: err.message });
  }
});

// DETALLE
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const skipCount = req.query.skipCount === "true";
    let movie;

    if (skipCount) {
      movie = await Movie.findById(id);
    } else {
      movie = await Movie.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
    }
    if (!movie) return res.status(404).json({ error: "No encontrado" });
    return res.json(movie);
  } catch (err) {
    console.error("Error GET /api/movies/:id:", err);
    return res.status(500).json({ error: err.message });
  }
});

// CREAR
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const m = new Movie({ ...req.body /*, Type: "movie" si lo necesitas */ });
    await m.save();
    return res.status(201).json(m);
  } catch (err) {
    console.error("Error POST /api/movies:", err);
    return res.status(400).json({ error: err.message });
  }
});

// ACTUALIZAR
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const m = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!m) return res.status(404).json({ error: "No encontrado" });
    return res.json(m);
  } catch (err) {
    console.error("Error PUT /api/movies/:id:", err);
    return res.status(400).json({ error: err.message });
  }
});

// ELIMINAR
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const m = await Movie.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: "No encontrado" });
    return res.json({ message: "Eliminado" });
  } catch (err) {
    console.error("Error DELETE /api/movies/:id:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
>>>>>>> 5582115 (veamos que sale)
