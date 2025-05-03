// src/routes/profiles.js
import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

/**
 * GET /api/profiles
 * → Devuelve TODOS los perfiles (admin y usuarios).
 *   Lo dejamos así para no romper el flujo de login.
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const perfiles = await Profile.find();
    return res.json(perfiles);
  } catch (err) {
    console.error("Error al obtener perfiles:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profiles
 * → Crea un perfil para el usuario autenticado
 */
router.post("/", requireAuth, async (req, res) => {
  const { name, dob } = req.body;
  if (!name || !dob) {
    return res.status(400).json({ error: "Faltan name o dob" });
  }
  const birth = new Date(dob);
  const diffMs = Date.now() - birth.getTime();
  const age = new Date(diffMs).getUTCFullYear() - 1970;
  const type = age < 13 ? "child" : "standard";

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

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
 * PUT /api/profiles/:id
 * → Edita un perfil existente
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id);
    if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

    // Solo el dueño o admin puede modificar un perfil
    if (req.userId !== perfil.user.toString() && req.userRole !== "admin") {
      return res.status(403).json({ error: "Sin permiso" });
    }

    const { name, dob } = req.body;
    if (name) perfil.name = name;
    if (dob) {
      const birth = new Date(dob);
      perfil.dob = birth;
      const diffMs = Date.now() - birth.getTime();
      perfil.age = new Date(diffMs).getUTCFullYear() - 1970;
      perfil.type = perfil.age < 13 ? "child" : "standard";
    }
    const actualizado = await perfil.save();
    return res.json(actualizado);
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/profiles/:id
 * → Elimina un perfil
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id);
    if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

    if (req.userId !== perfil.user.toString() && req.userRole !== "admin") {
      return res.status(403).json({ error: "Sin permiso" });
    }

    await perfil.deleteOne();
    return res.json({ message: "Perfil eliminado" });
  } catch (err) {
    console.error("Error al eliminar perfil:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profiles/:id/watchlist
 * → Añade `itemId` a la watchlist de ese perfil
 */
router.post(
  "/:id/watchlist",
  requireAuth,
  async (req, res) => {
    try {
      const { itemId } = req.body;
      const perfil = await Profile.findById(req.params.id);
      if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

      // Solo el dueño o admin puede modificar la watchlist
      if (req.userId !== perfil.user.toString() && req.userRole !== "admin") {
        return res.status(403).json({ error: "Sin permiso" });
      }

      const actualizado = await Profile.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { watchlist: itemId } },
        { new: true }
      );
      return res.json(actualizado);
    } catch (err) {
      console.error("Error añadiendo watchlist:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

/**
 * DELETE /api/profiles/:id/watchlist/:itemId
 * → Elimina `itemId` de la watchlist
 */
router.delete(
  "/:id/watchlist/:itemId",
  requireAuth,
  async (req, res) => {
    try {
      const perfil = await Profile.findById(req.params.id);
      if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

      if (req.userId !== perfil.user.toString() && req.userRole !== "admin") {
        return res.status(403).json({ error: "Sin permiso" });
      }

      const actualizado = await Profile.findByIdAndUpdate(
        req.params.id,
        { $pull: { watchlist: req.params.itemId } },
        { new: true }
      );
      return res.json(actualizado);
    } catch (err) {
      console.error("Error eliminando watchlist:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

/**
 * GET /api/profiles/:id/watchlist
 * → Devuelve SOLO los IDs de la watchlist de un perfil (con permisos)
 */
router.get(
  "/:id/watchlist",
  requireAuth,
  async (req, res) => {
    try {
      const perfil = await Profile.findById(req.params.id, "watchlist user");
      if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

      if (req.userId !== perfil.user.toString() && req.userRole !== "admin") {
        return res.status(403).json({ error: "Sin permiso" });
      }

      return res.json(perfil.watchlist);
    } catch (err) {
      console.error("Error obteniendo watchlist:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
