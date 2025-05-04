// src/routes/profiles.js
import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js"; // <-- sólo requireAuth

const router = express.Router();

/**
 * GET /api/profiles
 * - Admin: ve todos los perfiles (sin watchlist)
 * - Usuario normal: ve sólo los suyos (sin watchlist)
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const filter = req.userRole === "admin"
      ? {}
      : { user: req.userId };

    const perfiles = await Profile.find(filter).select("-watchlist");
    return res.json(perfiles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profiles
 * - Usuario autenticado: crea un nuevo perfil para sí mismo
 */
router.post("/", requireAuth, async (req, res) => {
  const { name, dob } = req.body;
  if (!name || !dob) {
    return res.status(400).json({ error: "Faltan name o dob" });
  }
  try {
    const birth = new Date(dob);
    const diffMs = Date.now() - birth.getTime();
    const age = new Date(diffMs).getUTCFullYear() - 1970;
    const type = age < 13 ? "child" : "standard";

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const nuevo = await Profile.create({
      name,
      dob: birth,
      age,
      type,
      user: req.userId,
      email: user.email,
    });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error al crear perfil:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/profiles/:id/watchlist
 * → Sólo el dueño o el admin pueden ver la lista
 */
router.get("/:id/watchlist", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id, "watchlist user");
    if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

    if (
      req.userRole !== "admin" &&
      perfil.user.toString() !== req.userId
    ) {
      return res.status(403).json({ error: "Sin permiso" });
    }

    return res.json(perfil.watchlist);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profiles/:id/watchlist
 * → Sólo el dueño o el admin pueden modificar su watchlist
 */
router.post("/:id/watchlist", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id);
    if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

    if (
      req.userRole !== "admin" &&
      perfil.user.toString() !== req.userId
    ) {
      return res.status(403).json({ error: "Sin permiso" });
    }

    const actualizado = await Profile.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { watchlist: req.body.itemId } },
      { new: true }
    );
    return res.json(actualizado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/profiles/:id/watchlist/:itemId
 * → Sólo el dueño o el admin pueden modificar su watchlist
 */
router.delete("/:id/watchlist/:itemId", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id);
    if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

    if (
      req.userRole !== "admin" &&
      perfil.user.toString() !== req.userId
    ) {
      return res.status(403).json({ error: "Sin permiso" });
    }

    const actualizado = await Profile.findByIdAndUpdate(
      req.params.id,
      { $pull: { watchlist: req.params.itemId } },
      { new: true }
    );
    return res.json(actualizado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
