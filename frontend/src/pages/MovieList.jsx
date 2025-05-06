// src/pages/MovieList.jsx

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import background from "../assets/descarga.jpeg";
import { isKidSafe } from "../Utils/ratings";
import api from "../services/api";

export default function MovieList() {
  const { user, token, activeProfile, addToWatchlist, removeFromWatchlist } =
    useContext(AuthContext);
  const { searchTerm } = useContext(SearchContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  // Estados para filtros
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [minRatingFilter, setMinRatingFilter] = useState("");
  const [yearFromFilter, setYearFromFilter] = useState("");
  const [yearToFilter, setYearToFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        // Construir parámetros con filtros
        const params = {
          page: currentPage,
          limit: moviesPerPage,
          type: "movie",
          ...(minRatingFilter && { minRating: minRatingFilter }),
          ...(yearFromFilter && { yearFrom: yearFromFilter }),
          ...(yearToFilter && { yearTo: yearToFilter }),
        };
        // 1) Listado paginado con filtros
        const { movies: base, total } = await api.movies.list(params, token);
        // 2) Detalle actualizado
        const detailed = await Promise.all(
          base.map((m) => api.movies.get(`${m._id ?? m.imdbID}?skipCount=true`, token))
        );
        if (!mounted) return;
        setMovies(detailed);
        setTotalMovies(total);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
        toast.error(err.message);
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [currentPage, token, minRatingFilter, yearFromFilter, yearToFilter]);

  const isKid = activeProfile?.type === "child";
  const filtered = movies
    .filter((m) =>
      m.Title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((m) => (isKid ? isKidSafe(m.Rated, activeProfile.age) : true));

    {loading ? (
      <p className="text-center py-10 text-white">Cargando…</p>
    ) : filtered.length === 0 ? (
      <p>No hay resultados</p>
    ) : (
      <div className="grid …">…</div>
    )}

  

  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  const baseBtn =
    "px-4 py-2 rounded-lg shadow transition flex items-center justify-center";
  const themeBtn =
    theme === "dark"
      ? "bg-gray-800 text-white hover:bg-gray-700"
      : "bg-gray-100 text-gray-800 hover:bg-gray-200";
  const btnStyle = `${baseBtn} ${themeBtn}`;

  return (
    <section
      className="min-h-screen bg-cover bg-center py-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="container mx-auto px-4">
        {/* Encabezado con botón de filtros */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-yellow-600">
            Catálogo de Películas
          </h1>
          <button
            onClick={() => setFiltersVisible((v) => !v)}
            className={btnStyle}
          >
            🔍 Filtros
          </button>
        </div>

        {/* Panel de filtros */}
        {filtersVisible && (
          <div className="bg-white/20 p-4 rounded mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-white mb-1">
                  Rating mínimo (IMDb)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minRatingFilter}
                  onChange={(e) => setMinRatingFilter(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  placeholder="Ej: 7.5"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Año desde</label>
                <input
                  type="number"
                  value={yearFromFilter}
                  onChange={(e) => setYearFromFilter(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  placeholder="Ej: 2000"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Año hasta</label>
                <input
                  type="number"
                  value={yearToFilter}
                  onChange={(e) => setYearToFilter(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  placeholder="Ej: 2023"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMinRatingFilter("");
                    setYearFromFilter("");
                    setYearToFilter("");
                    setCurrentPage(1);
                  }}
                  className={btnStyle}
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setFiltersVisible(false)}
                  className={btnStyle}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listado de películas */}
        {filtered.length === 0 ? (
          <p className="text-center text-white">
            No se encontraron películas compatibles con tu perfil.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((movie) => (
              <div
                key={movie._id ?? movie.imdbID}
                className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md text-white flex flex-col"
              >
                <div className="w-full h-48 overflow-hidden rounded mb-4">
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-lg font-semibold mb-1">{movie.Title}</h2>
                <p className="text-sm opacity-80 mb-2">Año: {movie.Year}</p>
                {movie.imdbRating && (
                  <p className="text-sm mb-2">
                    IMDb: {movie.imdbRating} ({movie.imdbVotes} votos)
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-2 pt-4">
                  <Link to={`/movies/${movie._id ?? movie.imdbID}`} className={btnStyle}>
                    Detalle
                  </Link>

                  {activeProfile?.watchlist?.includes(movie._id) ? (
                    <button
                      onClick={() => removeFromWatchlist(movie._id)}
                      className={btnStyle}
                    >
                      Quitar de Favoritos
                    </button>
                  ) : (
                    <button
                      onClick={() => addToWatchlist(movie._id)}
                      className={btnStyle}
                    >
                      Añadir a Favoritos
                    </button>
                  )}

                  {user?.role === "admin" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/movies/edit/${movie._id}`)}
                        className={`${btnStyle} flex-1`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          Swal.fire({
                            title: "¿Eliminar película?",
                            text: "Esta acción no se puede deshacer.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Sí, eliminar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              api.movies
                                .removeById(movie._id, token)
                                .then(() =>
                                  setMovies((prev) => prev.filter((m) => m._id !== movie._id))
                                )
                                .then(() => toast.success("Película eliminada"))
                                .catch(() =>
                                  toast.error("No se pudo eliminar la película")
                                );
                            }
                          })
                        }
                        className={`${btnStyle} flex-1`}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        <div className="flex justify-center mt-10 gap-2">
          {Array.from({
            length: Math.max(1, Math.ceil(totalMovies / moviesPerPage)),
          }).map((_, idx) => {
            const page = idx + 1;
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`${btnStyle} ${isActive ? "opacity-90" : ""}`}>
                {page}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
