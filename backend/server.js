// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import profilesRouter from "./routes/profiles.js";
import moviesRouter from "./routes/Movies.js";
import reportsRouter from "./routes/reports.js";

dotenv.config();
//console.log("🚀 OMDB_API_KEY =", process.env.OMDB_API_KEY);

const app = express();

// para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Middleware de logging
app.use((req, res, next) => {
  //console.log(`→ Petición recibida: ${req.method} ${req.originalUrl}`);
  next();
});

// Montar rutas API
app.use("/api/auth", authRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/series", moviesRouter);   // alias para series
app.use("/api/users", usersRouter);
app.use("/api/reports", reportsRouter);

// Ruta raíz de la API (opcional)
app.get("/api", (req, res) => {
  res.send("API de Usuarios, Perfiles y Películas funcionando");
});

// Servir los archivos estáticos generados por Vite
app.use(express.static(path.resolve(__dirname, "frontend/dist")));

// Fallback: si NO es ruta /api/*, devolver index.html
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/dist/index.html"));
});

// Conexión a la base de datos y arranque del servidor
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  //console.error("❌ ERROR: No se encontró MONGO_URI en el archivo .env");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    // console.log("✅ Conectado a MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      // console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(() => {
    // console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });