// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cors());

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

// Ruta raíz de la API
app.get("/api", (_req, res) => {
  res.send("API de Usuarios, Perfiles y Películas funcionando");
});

// JSON de trailers o fallback
app.get("/api/movies-json", (req, res) => {
  console.log("🛠️ Petición a /api/movies-json recibida");
  const enriched = path.join(__dirname, "data", "movies.withTrailers.json");
  const original = path.join(__dirname, "data", "movies.json");
  let fileToServe = null;
  if (fs.existsSync(enriched)) fileToServe = enriched;
  else if (fs.existsSync(original)) fileToServe = original;
  if (!fileToServe) {
    console.error("❌ No se encontró JSON de películas");
    return res.status(404).send("Not Found");
  }
  console.log("🛠️ Sirviendo fichero:", fileToServe);
  res.sendFile(fileToServe);
});

// Servir frontend estático
const clientDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(clientDist));

// Fallback para SPA: cualquier ruta no-api entrega index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// Conexión a MongoDB y arranque
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ Faltó MONGO_URI en .env");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });
