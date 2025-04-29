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
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md text-white flex flex-col">
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
