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

  const [profiles, setProfiles] = useState([]);              // Para admin: lista de perfiles
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ① Si soy admin, cargo todos los perfiles para el <select>
  useEffect(() => {
    if (user?.role === "admin") {
      api.profiles
        .list(token)
        .then((plist) => {
          setProfiles(plist);
          setSelectedProfileId(plist[0]?._id || null);
        })
        .catch(() => toast.error("Error cargando perfiles"))
        .finally(() => setLoading(false));
    } else {
      setSelectedProfileId(activeProfile?._id);
      setLoading(false);
    }
  }, [user, token, activeProfile]);

  // ② Siempre que cambie el perfil seleccionado, cargo su watchlist
  useEffect(() => {
    if (!selectedProfileId) return;
    setLoading(true);
    api.profiles
      .getWatchlist(selectedProfileId, token)
      .then((ids) =>
        Promise.all(
          ids.map((id) => api.movies.get(id, token, { refresh: true }).catch(() => null))
        )
      )
      .then((movies) => setItems(movies.filter(Boolean)))
      .catch(() => toast.error("Error cargando favoritos"))
      .finally(() => setLoading(false));
  }, [selectedProfileId, token]);

  // ③ Función de borrado, reutiliza removeFromWatchlist del contexto
  const handleRemove = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Eliminar favorito?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (!isConfirmed) return;
    await removeFromWatchlist(id);
    setItems((prev) => prev.filter((m) => m._id !== id));
    toast.info("Favorito eliminado");
  };

  if (loading) return <p className="p-4">Cargando…</p>;
  if (!selectedProfileId) return <p className="p-4">Selecciona un perfil.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          ← Volver
        </button>
        {user?.role === "admin" && (
          <select
            className="border p-2 rounded"
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6">
        Lista de Favoritos
      </h2>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((movie) => (
            <div key={movie._id} className="bg-white rounded shadow p-4 flex flex-col">
              <Link to={`/movies/${movie._id}`} className="flex-grow">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-lg">{movie.Title}</h3>
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
        <p className="p-4">No hay favoritos.</p>
      )}
    </div>
  );
}
