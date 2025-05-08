// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routers
import usersRouter    from "./routes/users.js";
import authRouter     from "./routes/auth.js";
import profilesRouter from "./routes/profiles.js";
import moviesRouter   from "./routes/Movies.js";
import seriesRouter   from "./routes/Series.js";    // ← Importa aquí tu Series.js
import reportsRouter  from "./routes/reports.js";
import seedRouter     from "./routes/seed.js";
import tmdbRouter     from "./routes/tmdb.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 1) Middlewares globales
app.use(express.json());
app.use(cors()); // Ajusta el origen de tu frontend si es necesario

// 2) Rutas API
app.use("/api/tmdb",     tmdbRouter);
app.use("/api/seed",     seedRouter);
app.use("/api/auth",     authRouter);
app.use("/api/users",    usersRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/movies",   moviesRouter);
app.use("/api/series",   seriesRouter);
app.use("/api/reports",  reportsRouter);

// 3) Health check
app.get("/api", (_req, res) => {
  res.send("API de Usuarios, Perfiles, Películas y Series funcionando");
});

// 4) Sirviendo frontend estático
const clientDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(clientDist));

// 5) Fallback para SPA (cualquier ruta no /api)
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// 6) Conexión a MongoDB y arranque del servidor
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ Faltó MONGO_URI en .env");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT);
  })
  .catch(() => {
    process.exit(1);
  });
