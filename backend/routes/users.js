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
