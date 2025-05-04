// src/routes/profiles.js
import express from "express";
import Profile from "../models/Profile.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

/**
 * GET /api/profiles
 * Devuelve todos los perfiles (admin) o solo los del usuario autenticado (standard).
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const filter = req.userRole === "admin"
      ? {}
      : { user: req.userId };

    const perfiles = await Profile.find(filter).select("-watchlist");
    return res.json(perfiles);
  } catch (err) {
    console.error("Error GET /profiles:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * POST /api/profiles
 * Crea un nuevo perfil para el usuario autenticado.
 */
router.post("/", requireAuth, async (req, res) => {
  const { name, dob, avatar } = req.body;
  if (!name || !dob) {
    return res.status(400).json({ error: "Faltan name o dob" });
  }
  try {
    const birth = new Date(dob);
    const diffMs = Date.now() - birth.getTime();
    const age = new Date(diffMs).getUTCFullYear() - 1970;
    const type = age < 13 ? "child" : "standard";

    const nuevo = await Profile.create({
      name,
      dob: birth,
      age,
      type,
      user: req.userId,
      email: req.userEmail,          // asumo que tu requireAuth añade userEmail
      avatar,                        // si no lo recibes, quita esta línea
    });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error POST /profiles:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * GET /api/profiles/:id/watchlist
 * Devuelve la watchlist de un perfil (propio o admin).
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
    console.error("Error GET /profiles/:id/watchlist:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * POST /api/profiles/:id/watchlist
 * Añade un ítem a la watchlist de un perfil (propio o admin).
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

    perfil.watchlist.addToSet(req.body.itemId);
    await perfil.save();
    return res.json(perfil);
  } catch (err) {
    console.error("Error POST /profiles/:id/watchlist:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * DELETE /api/profiles/:id/watchlist/:itemId
 * Elimina un ítem de la watchlist (propio o admin).
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

    perfil.watchlist.pull(req.params.itemId);
    await perfil.save();
    return res.json(perfil);
  } catch (err) {
    console.error("Error DELETE /profiles/:id/watchlist/:itemId:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * DELETE /api/profiles/:pid
 * Elimina un perfil completo (propio o admin).
 */
router.delete("/:pid", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.pid);
    if (!perfil) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    if (
      req.userRole !== "admin" &&
      perfil.user.toString() !== req.userId
    ) {
      return res.status(403).json({ error: "Sin permiso" });
    }

    await Profile.findByIdAndDelete(req.params.pid);
    return res.json({ message: "Perfil eliminado correctamente" });
  } catch (err) {
    console.error("Error DELETE /profiles/:pid:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
