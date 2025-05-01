// src/components/Header.jsx

import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-toastify";

// Base URL de tu API
const API_BASE = import.meta.env.VITE_API_URL || "";

const Header = () => {
  const { pathname } = useLocation();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const { user, logout, activeProfile } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Ocultar toda la zona de botones en login, register o en "/" sin usuario
  const hideButtons =
    pathname === "/login" ||
    pathname === "/register" ||
    (pathname === "/" && !user);

  // Determina cuándo mostrar la barra de búsqueda
  const isSearchable =
    !hideButtons &&
    (pathname.startsWith("/movies") || pathname.startsWith("/series"));

  // Clases unificadas para TODOS los botones/enlaces de la cabecera
  const btnStyle = `
    px-3 py-1
    bg-gray-200 dark:bg-gray-700
    text-gray-900 dark:text-white
    rounded-lg shadow
    hover:bg-gray-300 dark:hover:bg-gray-600
    transition-colors
    flex-shrink-0
  `;

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
  return (
    <header className="bg-white dark:bg-[#0a0a23] text-gray-900 dark:text-yellow-400 py-4 px-6 shadow-md transition-colors duration-300">
      {/* Título */}
      <div className="flex justify-center">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight uppercase">
          🎬 Blockbuster Online
        </h1>
      </div>

      {/* Toggle Tema */}
      {!hideButtons && (
        <div className="mt-2 flex justify-end">
          <button onClick={toggleTheme} className={btnStyle}>
            {theme === "dark" ? "Claro" : "Oscuro"}
          </button>
        </div>
      )}

      {/* Navegación */}
      {!hideButtons && (
        <nav className="mt-4 flex flex-nowrap overflow-x-auto gap-4 px-2">
          {user && pathname !== "/home" && (
            <Link to="/home" className={btnStyle}>
              🏠 Inicio
            </Link>
          )}
          {pathname !== "/series" && (
            <Link to="/series" className={btnStyle}>
              Series
            </Link>
          )}
          {pathname !== "/movies" && (
            <Link to="/movies" className={btnStyle}>
              Películas
            </Link>
          )}
          {pathname !== "/rating" && (
            <Link to="/rating" className={btnStyle}>
              Rating
            </Link>
          )}

          {user?.role === "admin" && (
            <button onClick={handleSeed} className={btnStyle}>
              🚀 Carga masiva
            </button>
          )}
          {user?.role === "admin" && (
            <button onClick={handleReport} className={btnStyle}>
              Reporte
            </button>
          )}

          {user && activeProfile && (
            <Link to="/watchlist" className={btnStyle}>
              🎥 Mi Lista ({activeProfile.watchlist?.length || 0})
            </Link>
          )}

          {!user ? (
            <Link to="/login" className={btnStyle}>
              Iniciar Sesión
            </Link>
          ) : (
            <button onClick={handleLogout} className={btnStyle}>
              Cerrar Sesión
            </button>
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
