// src/routes/Movies.js
import express from "express";
import Movie from "../models/Movie.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

// ▶️ Debug: atrapa toda petición a /api/movies
router.use((req, res, next) => {
  console.log(`➡️ [Movies Router] ${req.method} ${req.originalUrl}`);
  next();
});

// LISTADO CON FILTROS
// GET /api/movies?page=1&limit=10&minRating=6&yearFrom=2000&yearTo=2023
router.get("/", requireAuth, async (req, res) => {
  try {
    const page      = parseInt(req.query.page,  10) || 1;
    const limit     = parseInt(req.query.limit, 10) || 10;
    const minRating = parseFloat(req.query.minRating);
    const yearFrom  = parseInt(req.query.yearFrom, 10);
    const yearTo    = parseInt(req.query.yearTo,   10);

    // Ya no filtramos por Type
    const query = {};

    if (!isNaN(minRating)) {
      query.imdbRating = { $gte: minRating };
    }
    if (!isNaN(yearFrom) || !isNaN(yearTo)) {
      query.Year = {};
      if (!isNaN(yearFrom)) query.Year.$gte = yearFrom;
      if (!isNaN(yearTo))   query.Year.$lte = yearTo;
    }

    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      Movie.find(query)
           .sort({ imdbRating: -1 })
           .skip(skip)
           .limit(limit),
      Movie.countDocuments(query)
    ]);

    console.log("🔍 [Movies GET] query:", query, "→ found:", results.length, "of", total);
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
    const m = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
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
