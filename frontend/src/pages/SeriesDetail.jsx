// src/pages/SeriesDetail.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Background from "../assets/descarga.jpeg";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function SeriesDetail() {
  const { id: rawId } = useParams();
  const sid = rawId.toString();
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
        const data = await api.series.get(sid, token);
        setSeries(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la serie");
      } finally {
        setLoading(false);
      }
    })();
  }, [sid, token, activeProfile, navigate]);

  const isFav = activeProfile?.watchlist?.includes(sid);

  const handleToggleFav = () => {
    if (!activeProfile) {
      toast.info("Selecciona primero un perfil");
      return;
    }
    if (isFav) {
      removeFromWatchlist(sid);
      toast.info("Serie removida de favoritos");
    } else {
      addToWatchlist(sid);
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
        <h1 className="text-2xl font-bold text-center mb-4">
          {series.Title}
        </h1>

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

        <p>
          <strong>Año:</strong> {series.Year ?? "N/A"}
        </p>
        <p>
          <strong>Rating IMDb:</strong> {series.imdbRating ?? "N/A"} (
          {series.imdbVotes ?? "0"} votos)
        </p>
        <p>
          <strong>Vistas:</strong> {series.views ?? 0}
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
