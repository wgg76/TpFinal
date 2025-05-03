// src/pages/WatchlistPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function WatchlistPage() {
  const navigate = useNavigate();
  const { token, user, activeProfile, removeFromWatchlist } =
    useContext(AuthContext);

  const [profiles, setProfiles] = useState([]);           // TODOS los perfiles (solo admin)
  const [selectedProfileId, setSelectedProfileId] = useState(
    activeProfile?._id ?? null
  );
  const [items, setItems] = useState([]);                 // películas cargadas
  const [loading, setLoading] = useState(true);

  // 1) Si el admin, cargar TODOS los perfiles
  useEffect(() => {
    if (user?.role === "admin") {
      api.profiles.list(token)
        .then((plist) => {
          setProfiles(plist);
          // si no hay ninguno seleccionado, selecciona el primero
          if (!selectedProfileId && plist.length > 0) {
            setSelectedProfileId(plist[0]._id);
          }
        })
        .catch(() => toast.error("No se pudo cargar la lista de perfiles"));
    }
  }, [user, token]);

  // 2) Cargar watchlist cada vez que cambie selectedProfileId
  useEffect(() => {
    const pid = user?.role === "admin" ? selectedProfileId : activeProfile?._id;
    if (!pid) {
      navigate("/profiles");
      return;
    }
    setLoading(true);
    api.profiles
      .getWatchlist(pid, token)
      .then((ids) =>
        Promise.all(
          ids.map((movieId) =>
            api.movies.get(movieId, token, { refresh: true }).catch(() => null)
          )
        )
      )
      .then((movies) => setItems(movies.filter(Boolean)))
      .catch(() => toast.error("Error cargando favoritos"))
      .finally(() => setLoading(false));
  }, [selectedProfileId, activeProfile, user, token, navigate]);

  // Eliminar un solo favorito (igual que antes)
  const handleRemove = async (movieId) => { /* ... */ };
  const handleClearAll = async () => { /* ... */ };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 0) Si admin, mostrar selector de perfiles */}
      {user?.role === "admin" && (
        <div className="mb-4">
          <label className="mr-2 font-semibold">Ver watchlist de:</label>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="p-2 border rounded"
          >
            {profiles.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Botones Volver / Borrar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ← Volver
        </button>
        <button
          onClick={handleClearAll}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Borrar todo
        </button>
      </div>

      {/* Título indicando de quién es la lista */}
      <h2 className="text-2xl font-bold mb-6">
        Watchlist de{" "}
        {user?.role === "admin"
          ? profiles.find((p) => p._id === selectedProfileId)?.name || "—"
          : activeProfile?.name}
        {" "}
        ({items.length})
      </h2>

      {/* Resto del render idéntico a antes */}
      {loading ? (
        <p className="p-4">Cargando favoritos…</p>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((movie) => (
            <div key={movie._id} className="bg-white rounded shadow p-4">
              <Link to={`/movies/${movie._id}`} className="block mb-2">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="font-semibold text-lg mt-2">
                  {movie.Title}
                </h3>
              </Link>
              <button
                onClick={() => handleRemove(movie._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-4">Aún no tiene favoritos.</p>
      )}
    </div>
  );
}
