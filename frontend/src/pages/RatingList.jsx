// src/pages/RatingList.jsx

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import background from "../assets/descarga.jpeg";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function RatingList() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) Pedimos top 10 películas y top 10 series
        const [moviesResp, seriesResp] = await Promise.all([
          api.movies.list({ page: 1, limit: 10, type: "movie" }, token),
          api.series.list({ page: 1, limit: 10 }, token),
        ]);

        const movies = moviesResp.movies || moviesResp.items || [];
        const series = seriesResp.movies  // en series router devolvemos { movies: [...], total }
          ? seriesResp.movies
          : seriesResp.items || [];

        // 2) Normalizamos para tener el mismo shape
        const normalized = [
          ...movies.map(m => ({
            ...m,
            Type: "movie"
          })),
          ...series.map(s => ({
            ...s,
            Type: "series"
          })),
        ];

        // 3) Ordenamos por imdbRating desc
        normalized.sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0));

        setItems(normalized);
      } catch (err) {
        console.error("Error cargando ratings:", err);
        toast.error("No se pudo cargar la lista de ratings");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <p className="text-center py-10 text-white bg-cover" style={{ backgroundImage: `url(${background})` }}>
        Cargando…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-10 text-white bg-cover" style={{ backgroundImage: `url(${background})` }}>
        No hay contenido disponible.
      </p>
    );
  }

  return (
    <section
      className="min-h-screen bg-cover bg-center py-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-yellow-600 mb-6 text-center">
          Top IMDb Movies & Series
        </h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map(item => (
            <div
              key={item._id}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md text-white flex flex-col"
            >
              <Link
                to={`/${item.Type === "movie" ? "movies" : "series"}/${item._id}`}
                className="flex-grow"
              >
                <div className="w-full h-48 overflow-hidden rounded mb-4">
                  <img
                    src={item.Poster}
                    alt={item.Title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold mb-1">{item.Title}</h2>
                <p className="text-sm opacity-80 mb-1">Año: {item.Year}</p>
                <p className="text-sm">
                  IMDb: {item.imdbRating ?? "N/A"}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
