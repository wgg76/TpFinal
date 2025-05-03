// src/routes/profiles.js
import express from "express";
import Profile from "../models/Profile.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

/**
 * 1) LISTAR TODOS LOS PERFILES DEL USUARIO AUTENTICADO
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.userId });
    res.json(profiles);
  } catch (err) {
    console.error("Error al listar perfiles:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2) CREAR NUEVO PERFIL (se asocia automáticamente al userId)
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const profile = new Profile({
      ...req.body,
      userId: req.userId,       // ← asociamos el perfil al usuario
      watchlist: [],            // iniciamos lista vacía
    });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error("Error al crear perfil:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * 3) DETALLE DE UN PERFIL PROPIO
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      userId: req.userId,       // ← sólo si te pertenece
    });
    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    res.json(profile);
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 4) ACTUALIZAR UN PERFIL PROPIO
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * 5) BORRAR UN PERFIL PROPIO
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const removed = await Profile.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!removed) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    res.json({ message: "Perfil eliminado" });
  } catch (err) {
    console.error("Error al borrar perfil:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 6) AÑADIR ITEM AL WATCHLIST DE UN PERFIL PROPIO
 */
router.post(
  "/:profileId/watchlist",
  requireAuth,
  async (req, res) => {
    try {
      const profile = await Profile.findOne({
        _id: req.params.profileId,
        userId: req.userId,     // ← comprobamos propiedad
      });
      if (!profile) {
        return res.status(404).json({ error: "Perfil no encontrado" });
      }
      // no duplicados
      if (!profile.watchlist.includes(req.body.itemId)) {
        profile.watchlist.push(req.body.itemId);
        await profile.save();
      }
      res.json(profile);
    } catch (err) {
      console.error("Error al añadir watchlist:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

/**
 * 7) ELIMINAR ITEM DEL WATCHLIST DE UN PERFIL PROPIO
 */
router.delete(
  "/:profileId/watchlist/:itemId",
  requireAuth,
  async (req, res) => {
    try {
      const profile = await Profile.findOne({
        _id: req.params.profileId,
        userId: req.userId,
      });
      if (!profile) {
        return res.status(404).json({ error: "Perfil no encontrado" });
      }
      profile.watchlist = profile.watchlist.filter(
        (i) => i !== req.params.itemId
      );
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error("Error al eliminar watchlist:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
