// src/pages/BulkUploader.jsx

import React, { useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "";
// Asegúrate de colocar movies.json en /public/data/movies.json
const SOURCE_URL = "/data/movies.json";

export default function BulkUploader() {
  const { token } = useContext(AuthContext);

  const handleUpload = async () => {
    try {
      // 1) Cargar el JSON local
      const resp = await fetch(SOURCE_URL);
      if (!resp.ok) throw new Error("No se pudo cargar movies.json");
      const data = await resp.json();

      // 2) Tomar los primeros 20
      const first20 = data.slice(0, 20);

      // 3) Insertar uno a uno en tu propia API
      for (const movie of first20) {
        const newMovie = {
          Title: movie.Title,
          Year: movie.Year,
          Rated: movie.Rated,
          Released: movie.Released,
          Runtime: movie.Runtime,
          Genre: movie.Genre,
          Director: movie.Director,
          Writer: movie.Writer,
          Actors: movie.Actors,
          Plot: movie.Plot,
          Language: movie.Language,
          Country: movie.Country,
          Awards: movie.Awards,
          Poster: movie.Poster,
          Metascore: movie.Metascore,
          imdbRating: movie.imdbRating,
          imdbVotes: movie.imdbVotes,
          imdbID: movie.imdbID,
          Type: movie.Type,
          Response: movie.Response,
          Images: movie.Images,
        };

        const postRes = await fetch(`${API_BASE}/movies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify(newMovie),
        });

        if (!postRes.ok) {
          console.error(`❌ Error cargando '${movie.Title}': ${postRes.status}`);
        } else {
          console.log(`✅ Cargado: ${movie.Title}`);
        }
      }

      toast.success("Carga masiva finalizada ✅");
    } catch (err) {
      console.error("❌ Error en carga masiva:", err);
      toast.error("Error al realizar la carga masiva");
    }
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Carga masiva de películas</h1>
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
      >
        Cargar 20 películas
      </button>
    </div>
  );
}
