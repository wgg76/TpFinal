// scripts/add-trailers.js
// Este script lee backend/data/movies.json, busca trailers en YouTube usando YouTube Data API
// y genera movies.withTrailers.json con enlaces válidos a los trailers.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // Asegúrate de instalar node-fetch v2: npm install node-fetch@2

// para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clave de API de YouTube (configúrala en tu .env)
const YT_API_KEY = process.env.YT_API_KEY;
if (!YT_API_KEY) {
  console.error("❌ Debes configurar YT_API_KEY en tus variables de entorno");
  process.exit(1);
}

// 1. Leer JSON original
const dataFile = path.resolve(__dirname, "../data/movies.json");
let movies;
try {
  movies = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
} catch (err) {
  console.error("❌ Error leyendo movies.json:", err);
  process.exit(1);
}

// Función para buscar trailer en YouTube por título
async function fetchTrailerUrl(title) {
  const q = encodeURIComponent(`${title} official trailer`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${q}&key=${YT_API_KEY}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.items && json.items.length > 0) {
      const videoId = json.items[0].id.videoId;
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (err) {
    console.warn(`⚠️ No se pudo obtener trailer para ${title}:`, err);
  }
  return "";
}

// 2. Enriquecer cada objeto con trailerUrl consultando YouTube cuando no exista
(async () => {
  const enriched = [];
  for (const item of movies) {
    let url = item.trailerUrl;
    if (!url || !url.includes('youtube.com/embed')) {
      url = await fetchTrailerUrl(item.Title);
      console.log(`🎬 Trailer para ${item.Title}:`, url ? 'OK' : 'No encontrado');
    }
    enriched.push({ ...item, trailerUrl: url });
  }
  
  // 3. Escribir nuevo JSON con identación
  const outFile = path.resolve(__dirname, "../data/movies.withTrailers.json");
  try {
    fs.writeFileSync(outFile, JSON.stringify(enriched, null, 2), "utf-8");
    console.log(`✅ movies.withTrailers.json generado en ${outFile}`);
  } catch (err) {
    console.error("❌ Error escribiendo movies.withTrailers.json:", err);
    process.exit(1);
  }
})();
