// src/pages/WatchlistPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const WatchlistPage = () => {
  const navigate = useNavigate();
  const { token, activeProfile, removeFromWatchlist } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial de favoritos
  useEffect(() => {
    if (!activeProfile) {
      navigate("/profiles");
      return;
    }
    (async () => {
      try {
        const movies = await Promise.all(
          (activeProfile.watchlist || []).map((movieId) =>
            fetch(`/api/movies/${movieId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then((r) => {
              if (!r.ok) throw new Error();
              return r.json();
            })
          )
        );
        setItems(movies);
      } catch {
        toast.error("Error cargando favoritos");
      } finally {
        setLoading(false);
      }
    })();
  }, [activeProfile, token, navigate]);

  // Eliminar un solo favorito
  const handleRemove = async (movieId) => {
    const result = await Swal.fire({
      title: "¿Eliminar este favorito?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await removeFromWatchlist(movieId);
      setItems((prev) => prev.filter((m) => m._id !== movieId));
      toast.info("Favorito eliminado");
    } catch {
      // removeFromWatchlist ya muestra error si falla
    }
  };

  // Borrar todos los favoritos
  const handleClearAll = async () => {
    const result = await Swal.fire({
      title: "¿Borrar toda la lista?",
      text: "Esta acción eliminará todos tus favoritos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar todo",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      // eliminamos uno a uno para actualizar activeProfile
      for (const m of activeProfile.watchlist) {
        // eslint-disable-next-line no-await-in-loop
        await removeFromWatchlist(m);
      }
      setItems([]);
      toast.info("Todos los favoritos han sido borrados");
    } catch {
      // errores ya notificados en removeFromWatchlist
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Volver y Borrar Todo */}
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

      {/* Título */}
      <h2 className="text-2xl font-bold mb-6">
        Mi Lista ({activeProfile?.watchlist?.length || 0})
      </h2>

      {/* Estado */}
      {loading ? (
        <p className="p-4">Cargando favoritos…</p>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((movie) => (
            <div
              key={movie._id}
              className="bg-white rounded shadow hover:shadow-lg transition p-4 flex flex-col"
            >
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
        <p className="p-4">Aún no tienes favoritos.</p>
      )}
    </div>
  );
};

export default WatchlistPage;
