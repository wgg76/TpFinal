// src/pages/SeriesList.jsx

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
import Paginator from "../components/Paginator";

export default function SeriesList() {
  const { user, token, activeProfile, addToWatchlist, removeFromWatchlist } =
    useContext(AuthContext);
  const { searchTerm } = useContext(SearchContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Datos y paginación
  const [series, setSeries] = useState([]);
  const [totalSeries, setTotalSeries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 10;

  // Estados para filtros
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [minRatingFilter, setMinRatingFilter] = useState("");
  const [yearFromFilter, setYearFromFilter] = useState("");
  const [yearToFilter, setYearToFilter] = useState("");

  // Carga de datos con filtros y paginación
  useEffect(() => {
    let mounted = true;
  setLoading(true);

  async function loadPage() {
    try {
      const params = {
        page: currentPage,
        limit: seriesPerPage,
        type: "series",
        ...(minRatingFilter && { minRating: minRatingFilter }),
        ...(yearFromFilter && { yearFrom: yearFromFilter }),
        ...(yearToFilter && { yearTo: yearToFilter }),
      };
      const { movies: base, total } = await api.series.list(params, token);
      const detailed = await Promise.all(
        base.map((s) =>
          api.series.get(`${s._id ?? s.imdbID}?skipCount=true`, token)
        )
      );
      if (mounted) {
        setSeries(detailed);
        setTotalSeries(total);
      }
    } catch (err) {
      if (mounted) {
        setError(err.message);
        toast.error(err.message);
      }
    } finally {
      if (mounted) setLoading(false);
    }
  }

  loadPage();
  return () => { mounted = false; };
  }, [currentPage, token, minRatingFilter, yearFromFilter, yearToFilter]);

  // Estados de carga o error
  if (loading) {
    return <p className="text-center py-10 text-white">Cargando…</p>;
  }
  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  // Filtrado por búsqueda y edad
  const isKid = activeProfile?.type === "child";
  const filtered = series
    .filter((s) => s.Title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((s) => (isKid ? isKidSafe(s.Rated, activeProfile.age) : true));

  // Estilos de botón
  const baseBtn = "px-4 py-2 rounded-lg shadow transition flex items-center justify-center";
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

        {/* Encabezado con toggle de filtros */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-yellow-600">Catálogo de Series</h1>
          <button onClick={() => setFiltersVisible((v) => !v)} className={btnStyle}>
            🔍 Filtros
          </button>
        </div>

        {/* Panel de filtros */}
        {filtersVisible && (
          <div className="bg-white/20 p-4 rounded mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-white mb-1">Rating mínimo (IMDb)</label>
                <input
                  type="number" step="0.1" min="0" max="10"
                  value={minRatingFilter}
                  onChange={(e) => setMinRatingFilter(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  placeholder="Ej: 8.0"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Año desde</label>
                <input
                  type="number"
                  value={yearFromFilter}
                  onChange={(e) => setYearFromFilter(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  placeholder="Ej: 2010"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Año hasta</label>
                <input
                  type="number"
                  value={yearToFilter}
                  onChange={(e) => setYearToFilter(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  placeholder="Ej: 2025"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setMinRatingFilter(""); setYearFromFilter(""); setYearToFilter(""); setCurrentPage(1); }}
                  className={btnStyle}
                >Limpiar</button>
                <button onClick={() => setFiltersVisible(false)} className={btnStyle}>Aplicar</button>
              </div>
            </div>
          </div>
        )}

        {/* Listado de series */}
        {filtered.length === 0 ? (
          <p className="text-center text-white">No se encontraron series compatibles con tu perfil.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((serie) => (
              <div key={serie._id ?? serie.imdbID} className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md text-white flex flex-col">
                <div className="w-full h-48 overflow-hidden rounded mb-4">
                  <img src={serie.Poster} alt={serie.Title} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-lg font-semibold mb-1">{serie.Title}</h2>
                <p className="text-sm opacity-80 mb-2">Año: {serie.Year}</p>
                {serie.imdbRating && (
                  <p className="text-sm mb-2">IMDb: {serie.imdbRating} ({serie.imdbVotes} votos)</p>
                )}
                <div className="mt-auto flex flex-col gap-2 pt-4">
                  <Link to={`/series/${serie._id ?? serie.imdbID}`} className={btnStyle}>Detalle</Link>
                  {activeProfile?.watchlist?.includes(serie._id ?? serie.imdbID) ? (
                    <button onClick={() => removeFromWatchlist(serie._id ?? serie.imdbID)} className={btnStyle}>Quitar de Favoritos</button>
                  ) : (
                    <button onClick={() => addToWatchlist(serie._id ?? serie.imdbID)} className={btnStyle}>Añadir a Favoritos</button>
                  )}
                  {user?.role === "admin" && (
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/series/edit/${serie._id}`)} className={`${btnStyle} flex-1`}>Editar</button>
                      <button onClick={() => Swal.fire({ title: "¿Eliminar serie?", text: "Esta acción no se puede deshacer.", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Sí, eliminar" }).then(result => { if (result.isConfirmed) { api.series.removeById(serie._id, token).then(() => setSeries(prev => prev.filter(s => s._id !== serie._id))).then(() => toast.success("Serie eliminada")).catch(() => toast.error("No se pudo eliminar la serie")); } })} className={`${btnStyle} flex-1`}>Eliminar</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginador */}
        <Paginator currentPage={currentPage} totalPages={Math.max(1, Math.ceil(totalSeries / seriesPerPage))} onPageChange={setCurrentPage} />
      </div>
    </section>
  );
}
