// src/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import dotenv from "dotenv";

dotenv.config();

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta-super-segura";

/**
 * Registro de usuario
 */
authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body; // ya no tomamos role desde el cliente

    // Verificar si ya existe ese email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Validar longitud mínima de la contraseña
    if (password.length < 8) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    // Hashear contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Crear usuario; el servidor impone siempre el rol "standard"
    const newUser = new User({
      email: email.toLowerCase().trim(),
      password: hashed,
      role: "standard",
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Login de usuario
 * Ahora emite accessToken + refreshToken y guarda el refresh en BD
 */
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }

    // Comparar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }

    // Generar access token (corto)
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Generar refresh token (largo)
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Guardar el refresh token hasheado en BD
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await RefreshToken.create({
      userId: user._id,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    });

    // Devolvemos ambos tokens (token = accessToken para compatibilidad)
    res.json({
      message: "Inicio de sesión exitoso",
      token: accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

/**
 * Renueva tokens usando un refresh token válido
 */
authRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken es requerido" });
  }

  try {
    // Verificar firma
    const payload = jwt.verify(refreshToken, JWT_SECRET);

    // Verificar existencia en DB
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const record = await RefreshToken.findOne({ tokenHash: hash });
    if (!record || record.expiresAt < Date.now()) {
      return res
        .status(401)
        .json({ error: "Refresh token inválido o expirado" });
    }

    // Rotación: eliminar el antiguo
    await record.deleteOne();

    // Generar nuevos tokens
    const newAccessToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    const newRefreshToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Guardar el nuevo refresh en BD
    const newHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await RefreshToken.create({
      userId: payload.userId,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(401).json({ error: "No autorizado" });
  }
});

/**
 * Logout: revoca un refresh token
 */
authRouter.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken es requerido" });
  }

  try {
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await RefreshToken.deleteOne({ tokenHash: hash });
    return res.json({ message: "Cierre de sesión exitoso" });
  } catch (err) {
    return res.status(500).json({ error: "Error al cerrar sesión" });
  }
});

export default authRouter;
