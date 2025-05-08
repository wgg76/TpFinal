// src/routes/series.js
import express from "express";
import Series from "../models/Series.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

// ▶️ Debug: todas las peticiones
router.use((req, res, next) => {
  console.log(`➡️ [Series Router] ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * GET /api/series
 * Listado paginado y opcionalmente filtrado.
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const page      = parseInt(req.query.page,  10) || 1;
    const limit     = parseInt(req.query.limit, 10) || 20;
    const minRating = req.query.minRating != null ? parseFloat(req.query.minRating) : NaN;
    const yearFrom  = req.query.yearFrom  != null ? parseInt(req.query.yearFrom, 10) : NaN;
    const yearTo    = req.query.yearTo    != null ? parseInt(req.query.yearTo,   10) : NaN;
    const skip      = (page - 1) * limit;

    const query = {};
    if (!isNaN(minRating)) {
      query.imdbRating = { $gte: minRating };
    }
    if (!isNaN(yearFrom) || !isNaN(yearTo)) {
      query.Year = {};
      if (!isNaN(yearFrom)) query.Year.$gte = yearFrom.toString();
      if (!isNaN(yearTo))   query.Year.$lte = yearTo.toString();
    }

    const [items, total] = await Promise.all([
      Series.find(query).sort({ imdbRating: -1 }).skip(skip).limit(limit),
      Series.countDocuments(query)
    ]);

    console.log("🔍 [Series GET] query:", query, "→ found:", items.length, "of", total);
    // IMPORTANTE: renombramos "items" a "movies" (como hace tu MovieList)
    return res.json({ movies: items, total, page, limit });
  } catch (err) {
    console.error("Error GET /api/series:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/series/:id
 * Detalle de serie. Si skipCount!=true, incrementa views.
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const skipCount = req.query.skipCount === "true";
    const operation = skipCount
      ? Series.findById(id)
      : Series.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    const serie = await operation;
    if (!serie) return res.status(404).json({ error: "Serie no encontrada" });
    return res.json(serie);
  } catch (err) {
    console.error("Error GET /api/series/:id:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/series
 * Crea una nueva serie (admin only), usando imdbID como _id.
 */
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { imdbID, Title, Year, imdbRating, imdbVotes, Poster } = req.body;
    if (!imdbID) {
      return res.status(400).json({ error: "imdbID es obligatorio" });
    }
    const newSeries = new Series({
      _id:         imdbID,
      Title,
      Year:        Year?.toString(),
      imdbRating,
      imdbVotes,
      Poster,
      views:       0,
    });
    await newSeries.save();
    return res.status(201).json(newSeries);
  } catch (err) {
    console.error("Error POST /api/series:", err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /api/series/:id
 * Actualiza una serie existente (admin only).
 */
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await Series.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Serie no encontrada" });
    return res.json(updated);
  } catch (err) {
    console.error("Error PUT /api/series/:id:", err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /api/series/:id
 * Elimina una serie (admin only).
 */
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Series.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Serie no encontrada" });
    return res.json({ message: "Serie eliminada" });
  } catch (err) {
    console.error("Error DELETE /api/series/:id:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
