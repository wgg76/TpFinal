// src/middleware/requireAuth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta";

export async function requireAuth(req, res, next) {
  const auth = req.header("Authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }
  let payload;
  try {
    payload = jwt.verify(auth.split(" ")[1], JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
  const account = await User.findById(payload.userId);
  if (!account) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }
  req.userId   = payload.userId;
  req.userRole = payload.role;
  next();
}

export function requireAdmin(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Solo administradores" });
  }
  next();
}
