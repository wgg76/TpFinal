// src/pages/SeriesDetail.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Background from "../assets/descarga.jpeg";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "";

function SeriesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, activeProfile, addToWatchlist, removeFromWatchlist } =
    useContext(AuthContext);

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProfile) {
      navigate("/profiles");
      return;
    }

    (async () => {
      try {
        const isImdb = /^tt\d+$/.test(id);
        // En prod usa tu BACKEND, en dev cae en el proxy de Vite a localhost:5000
        const endpoint = isImdb
          ? `${API_BASE}/movies/imdb/${id}`
          : `${API_BASE}/movies/${id}`;

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar la serie");
        setSeries(await res.json());
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la serie");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token, activeProfile, navigate]);

  const handleToggleFav = () => {
    if (!activeProfile) return toast.info("Selecciona primero un perfil");
    if (activeProfile.watchlist?.includes(id)) {
      removeFromWatchlist(id);
      toast.info("Serie removida de favoritos");
    } else {
      addToWatchlist(id);
      toast.success("Serie agregada a favoritos");
    }
  };

  if (loading) return <p className="text-center">Cargando…</p>;
  if (!series) return <p className="text-center">Serie no encontrada.</p>;

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
        <h1 className="text-2xl font-bold text-center mb-4">{series.Title}</h1>

        {series.Poster && series.Poster !== "N/A" ? (
          <img
            src={series.Poster}
            alt={series.Title}
            onError={(e) => (e.target.style.display = "none")}
            className="w-full h-auto mb-4 rounded object-cover"
          />
        ) : (
          <p className="text-center mb-4">Sin imagen</p>
        )}

        {/* Campos básicos */}
        <p>
          <strong>Temporadas:</strong> {series.totalSeasons || "N/A"}
        </p>
        <p>
          <strong>Clasificación (Rated):</strong> {series.Rated || "N/A"}
        </p>
        <p>
          <strong>Sinopsis corta:</strong> {series.Plot || "N/A"}
        </p>

        {/* Campos extras */}
        <p className="mt-4">
          <strong>Plot completo:</strong>
          <br />
          {series.Plot || "N/A"}
        </p>

        {series.Metascore !== "N/A" && (
          <p>
            <strong>Metascore:</strong> {series.Metascore}
          </p>
        )}

        <div>
          <strong>Ratings:</strong>
          <ul className="list-disc ml-5">
            {series.Ratings?.length ? (
              series.Ratings.map((r, i) => (
                <li key={i}>
                  {r.Source}: {r.Value}
                </li>
              ))
            ) : (
              <li>
                IMDb Rating: {series.imdbRating ?? "N/A"}
                {series.imdbVotes ? ` (${series.imdbVotes} votos)` : ""}
              </li>
            )}
          </ul>
        </div>

        {/* Botones */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleToggleFav}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {activeProfile?.watchlist?.includes(id)
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
};

export default SeriesDetail;
