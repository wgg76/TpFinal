<<<<<<< HEAD
// src/routes/users.js
import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();

// Listar _id y username de todos los usuarios (cualquiera autenticado)
router.get("/", requireAuth, async (req, res) => {
  try {
    const users = await User.find({}, "_id username role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al listar usuarios" });
  }
});

export default router;
=======
// src/routes/users.js
import express from "express";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

// Listar _id, username y role de todos los usuarios (cualquiera autenticado)
router.get("/", requireAuth, async (req, res) => {
  try {
    const users = await User.find({}, "_id email role");
    res.json(users);
  } catch (err) {
    console.error("Error GET /api/users:", err);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
});

// Cambiar rol de un usuario (solo admin)
router.put("/:id/role", requireAuth, requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Rol inválido" });
  }
  try {
    const u = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json(u);
  } catch (err) {
    console.error("Error PUT /api/users/:id/role:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/users/:id/role
router.put("/:id/role", requireAuth, requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Rol inválido" });
  }
  const u = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
  return res.json(u);
});

export default router;
>>>>>>> 5582115 (veamos que sale)
