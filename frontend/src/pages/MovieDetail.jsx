<<<<<<< HEAD
// src/pages/MovieDetail.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Background from "../assets/descarga.jpeg";
import { AuthContext } from "../context/AuthContext";

//console.log("→ import.meta.env:", import.meta.env);
const API_BASE = import.meta.env.VITE_API_URL;
//console.log("→ API_BASE:", API_BASE);


export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    token,
    activeProfile,
    addToWatchlist,
    removeFromWatchlist,
  } = useContext(AuthContext);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProfile) {
      navigate("/profiles");
      return;
    }
    (async () => {
      try {
        const isImdb = /^tt\d+$/.test(id);
        // <-- Prefijo /api añadido aquí:
        const endpoint = isImdb
          ? `${API_BASE}/api/movies/imdb/${id}`
          : `${API_BASE}/api/movies/${id}`;
        //console.log("→ Fetching Movie:", endpoint);

        const res = await fetch(endpoint, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });
        if (!res.ok) throw new Error("Error al cargar la película");
        setMovie(await res.json());
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la película");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token, activeProfile, navigate]);

  const handleToggleFav = () => {
    if (!activeProfile) {
      toast.info("Selecciona primero un perfil");
      return;
    }
    if (activeProfile.watchlist?.includes(id)) {
      removeFromWatchlist(id);
      toast.info("Película removida de favoritos");
    } else {
      addToWatchlist(id);
      toast.success("Película agregada a favoritos");
    }
  };

  if (loading) return <p className="text-center">Cargando…</p>;
  if (!movie) return <p className="text-center">Película no encontrada.</p>;

  return (
    <div
      className="bg-black"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "140px",
        paddingBottom: "120px",
      }}
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-black">
        <h1 className="text-center font-bold mb-4 text-xl">
          {movie.Title}
        </h1>

        {movie.Poster && movie.Poster !== "N/A" ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            onError={(e) => (e.target.style.display = "none")}
            className="w-full h-auto mb-4 rounded object-cover"
          />
        ) : (
          <p className="text-center mb-4">Sin imagen</p>
        )}

        <p><strong>Año:</strong> {movie.Year || "N/A"}</p>
        <p><strong>Género:</strong> {movie.Genre || "N/A"}</p>
        <p><strong>Clasificación:</strong> {movie.Rated || "N/A"}</p>
        <p><strong>Sinopsis:</strong> {movie.Plot || "N/A"}</p>

        {movie.Metascore != null && (
          <p><strong>Metascore:</strong> {movie.Metascore}</p>
        )}

        <div>
          <strong>Ratings:</strong>
          <ul className="list-disc ml-5">
            {movie.Ratings?.length > 0
              ? movie.Ratings.map((r, i) => (
                  <li key={i}>
                    {r.Source}: {r.Value}
                  </li>
                ))
              : (
                <li>
                  IMDb: {movie.imdbRating ?? "N/A"}
                  {movie.imdbVotes ? ` (${movie.imdbVotes} votos)` : ""}
                </li>
              )}
          </ul>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleToggleFav}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {activeProfile.watchlist?.includes(id)
              ? "Quitar Favoritos"
              : "Agregar Favoritos"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
=======
// src/pages/MovieDetail.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Background from "../assets/descarga.jpeg";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function MovieDetail() {
  const { id: rawId } = useParams();
  const mid = rawId.toString();
  const navigate = useNavigate();
  const { token, activeProfile, addToWatchlist, removeFromWatchlist } =
    useContext(AuthContext);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProfile) {
      navigate("/profiles");
      return;
    }
    (async () => {
      try {
        // Llamada al endpoint GET /api/movies/:id
        const data = await api.movies.get(mid, token);
        setMovie(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la película");
      } finally {
        setLoading(false);
      }
    })();
  }, [mid, token, activeProfile, navigate]);

  const isFav = activeProfile?.watchlist?.includes(mid);

  const handleToggleFav = () => {
    if (!activeProfile) {
      toast.info("Selecciona primero un perfil");
      return;
    }
    if (isFav) {
      removeFromWatchlist(mid);
      toast.info("Película removida de favoritos");
    } else {
      addToWatchlist(mid);
      toast.success("Película agregada a favoritos");
    }
  };

  if (loading) return <p className="text-center">Cargando…</p>;
  if (!movie) return <p className="text-center">Película no encontrada.</p>;

  return (
    <div
      className="bg-black"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "140px",
        paddingBottom: "120px",
      }}
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-black">
        <h1 className="text-2xl font-bold text-center mb-4">
          {movie.Title}
        </h1>

        {movie.Poster && movie.Poster !== "N/A" ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            onError={(e) => (e.target.style.display = "none")}
            className="w-full h-auto mb-4 rounded object-cover"
          />
        ) : (
          <p className="text-center mb-4">Sin imagen</p>
        )}

        <p>
          <strong>Año:</strong> {movie.Year ?? "N/A"}
        </p>
        <p>
          <strong>Rating IMDb:</strong> {movie.imdbRating ?? "N/A"} (
          {movie.imdbVotes ?? "0"} votos)
        </p>
        <p>
          <strong>Vistas:</strong> {movie.views ?? 0}
        </p>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleToggleFav}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {isFav ? "Quitar Favoritos" : "Agregar Favoritos"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 5582115 (veamos que sale)
