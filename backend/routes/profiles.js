// src/routes/profiles.js
import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

/**
 * GET /api/profiles
 * Devuelve todos los perfiles (admin) o solo los del usuario autenticado (standard).
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const filter = req.userRole === "admin" ? {} : { user: req.userId };

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
  if (!name || !dob || !avatar) {
    return res.status(400).json({ error: "Faltan name, dob o avatar" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const birth = new Date(dob);
    const diffMs = Date.now() - birth.getTime();
    const age = new Date(diffMs).getUTCFullYear() - 1970;
    const type = age < 13 ? "child" : "standard";

    const nuevo = await Profile.create({
      name,
      dob: birth,
      avatar,
      age,
      type,
      user: req.userId,
      email: user.email,
    });

    return res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error POST /profiles:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/profiles/:id/role
 * Solo admin puede cambiar el role de un perfil.
 */
router.put(
  "/public/:publicId/role",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }
    try {
      const perfil = await Profile.findOneAndUpdate(
        { publicId: req.params.publicId },
        { role },
        { new: true }
      );
      if (!perfil)
        return res.status(404).json({ error: "Perfil no encontrado" });
      return res.json(perfil);
    } catch (err) {
      console.error("Error cambiando role:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

/**
 * GET /api/profiles/:id/watchlist
 */
router.get("/:id/watchlist", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id, "watchlist user");
    if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

    if (req.userRole !== "admin" && perfil.user.toString() !== req.userId) {
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
 */
router.post("/:id/watchlist", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id);
    if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

    if (req.userRole !== "admin" && perfil.user.toString() !== req.userId) {
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
 */
router.delete("/:id/watchlist/:itemId", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id);
    if (!perfil) return res.status(404).json({ error: "Perfil no encontrado" });

    if (req.userRole !== "admin" && perfil.user.toString() !== req.userId) {
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
 * DELETE /api/profiles/:id
 * Elimina un perfil completo (propio o admin).
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const perfil = await Profile.findById(req.params.id);
    if (!perfil) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    if (req.userRole !== "admin" && perfil.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Sin permiso" });
    }

    await Profile.findByIdAndDelete(req.params.id);
    return res.json({ message: "Perfil eliminado correctamente" });
  } catch (err) {
    console.error("Error DELETE /profiles/:id:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * PUT /api/profiles/:id
 * Actualiza un perfil existente (propio o admin), recalculando edad y tipo.
 */
router.put("/:id", requireAuth, async (req, res) => {
  const { name, dob, avatar } = req.body;
  if (!name || !dob || !avatar) {
    return res.status(400).json({ error: "Faltan name, dob o avatar" });
  }

  try {
    const perfil = await Profile.findById(req.params.id);
    if (!perfil) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    perfil.name = name;
    perfil.dob = new Date(dob);
    perfil.avatar = avatar;

    const diffMs = Date.now() - perfil.dob.getTime();
    perfil.age = new Date(diffMs).getUTCFullYear() - 1970;
    perfil.type = perfil.age < 13 ? "child" : "standard";

    const updated = await perfil.save();
    return res.json(updated);
  } catch (err) {
    console.error("Error PUT /profiles/:id:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
