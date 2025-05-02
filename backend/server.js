// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const app = express();

// para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => { next(); });

// Rutas API
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import profilesRouter from "./routes/profiles.js";
import moviesRouter from "./routes/Movies.js";
import reportsRouter from "./routes/reports.js";

app.use("/api/auth", authRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/series", moviesRouter);
app.use("/api/users", usersRouter);
app.use("/api/reports", reportsRouter);

// Ruta raíz API
app.get("/api", (req, res) => {
  res.send("API de Usuarios, Perfiles y Películas funcionando");
});

// Ruta para servir JSON enriquecido con trailerUrl
app.get("/api/movies-json", (req, res) => {
  const enriched = path.resolve(__dirname, "./data/movies.withTrailers.json");
  const original = path.resolve(__dirname, "./data/movies.json");
  const fileToServe = fs.existsSync(enriched) ? enriched : original;
  res.sendFile(fileToServe, (err) => {
    if (err) {
      console.error("❌ Error sirviendo", fileToServe, err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// Servir frontend Vite
app.use(express.static(path.resolve(__dirname, "frontend/dist")));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/dist/index.html"));
});

// Conexión Mongo
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) process.exit(1);

mongoose
  .connect(mongoURI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });
