// src/components/Header.jsx

import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { ThemeContext } from '../context/ThemeContext';
import { toast } from "react-toastify";

// ✏️ Asegúrate de tener en tu .env:
// VITE_API_URL=https://tpfinal-7qos.onrender.com/api
const API_BASE = import.meta.env.VITE_API_URL || "";

const Header = () => {
  const { pathname } = useLocation();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const { user, logout, activeProfile } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Ocultar en login / register / home sin usuario
  const hideButtons =
    pathname === "/login" ||
    pathname === "/register" ||
    (pathname === "/" && !user);

  const isSearchable =
    !hideButtons &&
    (pathname.startsWith("/movies") || pathname.startsWith("/series"));
  const isMoviesPage = pathname.startsWith("/movies");
  const isSeriesPage = pathname.startsWith("/series");

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const handleSeed = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/movies/seed`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Status ${res.status}`);
      }
      const data = await res.json();
      await Swal.fire({
        icon: "success",
        title: "¡Carga masiva completada!",
        text: `${data.count} elementos insertados.`,
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error en carga masiva",
        text: err.message,
      });
    }
  };

  const handleReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/reports/views`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No autorizado o error en servidor");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "views_report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("No se pudo descargar el reporte");
    }
  };

  const btnStyle = `
    px-4 py-2
    bg-gray-200 dark:bg-gray-700
    text-gray-900 dark:text-white
    rounded-lg shadow
    hover:bg-gray-300 dark:hover:bg-gray-600
    transition-colors
  `;

  return (
    <header className="bg-white dark:bg-[#0a0a23] text-gray-900 dark:text-yellow-400 py-4 px-6 shadow-md transition-colors duration-300">
      {/* Título */}
      <div className="flex justify-center">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight uppercase">
          🎬 Blockbuster Online
        </h1>
      </div>

      {/* Theme toggle */}
      {!hideButtons && (
        <div className="mt-2 flex justify-end">
          <button onClick={toggleTheme} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            {theme === "dark" ? "Claro" : "Oscuro"}
          </button>
        </div>
      )}

      {/* Navegación */}
      {!hideButtons && (
        <nav className="mt-4 flex flex-wrap justify-center gap-4">
          {user && pathname !== "/home" && <Link to="/home" className={btnStyle}>🏠 Inicio</Link>}
          {pathname !== "/series" && <Link to="/series" className={btnStyle}>Series</Link>}
          {pathname !== "/movies" && <Link to="/movies" className={btnStyle}>Películas</Link>}
          {pathname !== "/rating" && <Link to="/rating" className={btnStyle}>Rating</Link>}

          {user?.role === "admin" && isMoviesPage && (
            <Link to="/movies/create" className={btnStyle}>Agregar Película</Link>
          )}
          {user?.role === "admin" && isSeriesPage && (
            <Link to="/series/create" className={btnStyle}>Agregar Serie</Link>
          )}
          {user?.role === "admin" && (
            <button onClick={handleSeed} className={btnStyle}>🚀 Carga masiva</button>
          )}
          {user?.role === "admin" && (
            <button onClick={handleReport} className={btnStyle}>Reporte</button>
          )}

          {user && activeProfile && (
            <Link to="/watchlist" className={btnStyle}>
              🎥 Mi Lista ({activeProfile.watchlist?.length || 0})
            </Link>
          )}
          {user && (
            <button onClick={handleLogout} className={btnStyle}>Cerrar Sesión</button>
          )}
        </nav>
      )}

      {/* Search Bar */}
      {isSearchable && (
        <div className="mt-4 w-full max-w-3xl mx-auto">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      )}
    </header>
  );
};

export default Header;
