// src/pages/BulkUploader.jsx
import React from "react";

const BulkUploader = () => {
  const handleUpload = async () => {
    // Usa tu API propia, no MockAPI
    const apiUrl = "http://localhost:5000/api/movies";
    // Fuente: ahora apunta a tu propio archivo JSON
    const sourceUrl = "../data/movies.json";


    try {
      const response = await fetch(sourceUrl);
      const data = await response.json();
      const first20 = data.slice(0, 20); // Cargamos los primeros 20 registros

      for (const movie of first20) {
        // Aquí creamos un objeto con solo la estructura deseada para películas.
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
          Images: movie.Images
        };

        const postResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newMovie)
        });

        if (!postResponse.ok) {
          console.error(`❌ Error cargando: ${movie.Title}`);
        } else {
          console.log(`✅ Cargado: ${movie.Title}`);
        }
      }
      alert("Carga masiva finalizada ✅");
    } catch (error) {
      console.error("❌ Error al cargar películas:", error);
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
};

export default BulkUploader;
