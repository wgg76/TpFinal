<<<<<<< HEAD
// src/pages/RatingList.jsx

import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function RatingList() {
  const { token } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // 1) Obtiene top ya ordenado por backend
        const top = await api.movies.topImdb(token);

        // 2) Fuerza refresh en cada detalle
        const detailed = await Promise.all(
          top.map((m) => api.movies.get(m._id, token, { refresh: true }))
        );

        // 3) Asegura orden descendente por imdbRating
        const sorted = detailed.sort(
          (a, b) => (b.imdbRating || 0) - (a.imdbRating || 0)
        );

        if (!mounted) return;
        setMovies(sorted);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
        toast.error(err.message);
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  if (loading) return <p className="p-8 text-center">Cargando...</p>;
  if (error)   return <p className="p-8 text-center text-red-600">{error}</p>;
  if (!movies.length) return <p className="p-8 text-center">No hay datos.</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">🎖 Top IMDb Rated</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((m) => (
          <Link to={`/movies/${m._id}`} key={m._id} className="block">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md text-black flex flex-col">
              <div className="w-full h-64 overflow-hidden rounded mb-4">
                <img
                  src={m.Poster}
                  alt={m.Title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold">{m.Title}</h2>
              <p className="text-sm opacity-80">{m.Year || "N/A"}</p>
              {m.imdbRating != null && (
                <p className="mt-1">
                  IMDb: {m.imdbRating} ({m.imdbVotes || "N/A"} votos)
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
=======
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
>>>>>>> 5582115 (veamos que sale)
