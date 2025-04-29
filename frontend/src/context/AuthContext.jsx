// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeProfile, setActiveProfile] = useState(() => {
    const saved = localStorage.getItem("activeProfile");
    if (!saved) return null;
    const prof = JSON.parse(saved);
    return { watchlist: [], ...prof };
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;
    const { exp, userId, role } = JSON.parse(atob(savedToken.split(".")[1]));
    if (exp * 1000 < Date.now()) {
      logout();
    } else {
      setToken(savedToken);
      setUser({ userId, role });
      setTimeout(logout, exp * 1000 - Date.now());
    }
  }, []);

  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem("activeProfile", JSON.stringify(activeProfile));
    } else {
      localStorage.removeItem("activeProfile");
    }
  }, [activeProfile]);

  const login = (newToken) => {
    const { exp, userId, role } = JSON.parse(atob(newToken.split(".")[1]));
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser({ userId, role });
    setActiveProfile(null);
    setTimeout(logout, exp * 1000 - Date.now());
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeProfile");
    setToken(null);
    setUser(null);
    setActiveProfile(null);
    navigate("/login");
  };

  const addToWatchlist = async (itemId) => {
    if (!activeProfile) {
      toast.info("Selecciona primero un perfil");
      return;
    }
    try {
      const updated = await api.watchlist.add(activeProfile._id, itemId, token);
      setActiveProfile(updated);
      toast.success("Añadido a Favoritos");
    } catch (err) {
      toast.error("No se pudo añadir a Favoritos");
    }
  };

  const removeFromWatchlist = async (itemId) => {
    if (!activeProfile) {
      toast.info("Selecciona primero un perfil");
      return;
    }
    try {
      const updated = await api.watchlist.remove(activeProfile._id, itemId, token);
      setActiveProfile(updated);
      toast.info("Eliminado de Favoritos");
    } catch (err) {
      toast.error("No se pudo eliminar de Favoritos");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        activeProfile,
        setActiveProfile,
        login,
        logout,
        addToWatchlist,
        removeFromWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}