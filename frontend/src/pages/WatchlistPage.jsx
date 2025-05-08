// src/pages/WatchlistPage.jsx

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function WatchlistPage() {
  const navigate = useNavigate();
  const { token, activeProfile, user, removeFromWatchlist } = useContext(AuthContext);

  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) Inicializar selectedProfileId: admin ve todos, estándar solo el suyo
  useEffect(() => {
    if (user?.role === "admin") {
      setLoading(true);
      api.profiles
        .list(token)
        .then(plist => {
          setProfiles(plist);
          setSelectedProfileId(plist[0]?._id || null);
        })
        .catch(() => toast.error("Error cargando perfiles"))
        .finally(() => setLoading(false));
    } else if (activeProfile?._id) {
      setSelectedProfileId(activeProfile._id);
      setLoading(false);
    }
  }, [user?.role, token, activeProfile?._id]);

  // 2) Al cambiar selectedProfileId, cargar el watchlist
  useEffect(() => {
    if (!selectedProfileId) return;
    setLoading(true);

    api.profiles
      .getWatchlist(selectedProfileId, token) // devuelve array de IDs "tt..."
      .then(ids =>
        Promise.all(
          ids.map(async (id) => {
            // intento primero como película
            try {
              return await api.movies.get(id, token);
            } catch {
              // si falla, lo intento como serie
              try {
                return await api.series.get(id, token);
              } catch {
                return null;
              }
            }
          })
        )
      )
      .then(results => setItems(results.filter(Boolean)))
      .catch(() => toast.error("Error cargando tu lista"))
      .finally(() => setLoading(false));
  }, [selectedProfileId, token]);

  // 3) Función para quitar favorito
  const handleRemove = async (itemId) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Quitar de favoritos?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
    });
    if (!isConfirmed) return;

    try {
      // Llamamos a la función del context sin asignarla a una variable
      await removeFromWatchlist(itemId);
      setItems(prev => prev.filter(i => i._id !== itemId));
      toast.info("Eliminado de favoritos");
    } catch {
      toast.error("No se pudo eliminar de favoritos");
    }
  };

  if (loading) return <p className="p-4">Cargando…</p>;
  if (!selectedProfileId) return <p className="p-4">Selecciona un perfil.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ← Volver
        </button>
        {user?.role === "admin" && (
          <select
            className="border p-2 rounded"
            value={selectedProfileId}
            onChange={e => setSelectedProfileId(e.target.value)}
          >
            {profiles.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6">Mi Lista de Favoritos</h2>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded shadow p-4 flex flex-col">
              <Link
                to={`/${item.Type === "movie" ? "movies" : "series"}/${item._id}`}
                className="flex-grow"
              >
                <img
                  src={item.Poster}
                  alt={item.Title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-lg">{item.Title}</h3>
                <p className="text-sm opacity-75">
                  {item.Type === "movie" ? "Película" : "Serie"} • Año {item.Year}
                </p>
              </Link>
              <button
                onClick={() => handleRemove(item._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-4">No hay elementos en favoritos.</p>
      )}
    </div>
  );
}
