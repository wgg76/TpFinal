// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import profilesRouter from "./routes/profiles.js";
import moviesRouter from "./routes/Movies.js";
import reportsRouter from "./routes/reports.js";  // ← Importa el router de reportes

// Carga variables de entorno de .env
dotenv.config();
console.log("🚀 OMDB_API_KEY =", process.env.OMDB_API_KEY);

const app = express();

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`→ Petición recibida: ${req.method} ${req.originalUrl}`);
  next();
});

// Montar rutas
app.use("/api/auth", authRouter);           // Registro y login
app.use("/api/profiles", profilesRouter);   // CRUD de perfiles
app.use("/api/movies", moviesRouter);       // CRUD de películas
app.use("/api/series", moviesRouter);       // Alias para series, reutiliza el mismo router
app.use("/api/users", usersRouter);

// Nueva ruta de reportes de uso
app.use("/api/reports", reportsRouter);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API de Usuarios, Perfiles y Películas funcionando");
});

// Leer URI desde .env y validar
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ ERROR: No se encontró MONGO_URI en el archivo .env");
  process.exit(1);
}

// Conexión a la base de datos y arranque del servidor
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });
