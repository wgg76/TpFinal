// src/context/AuthContext.jsx

import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
 
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeProfile, setActiveProfile] = useState(() => {
    const saved = localStorage.getItem("activeProfile");
    if (!saved) return null;
    const prof = JSON.parse(saved);
    return { watchlist: [], ...prof };
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeProfile");
    setToken(null);
    setUser(null);
    setActiveProfile(null);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;
    const { exp, userId, role } = JSON.parse(
      atob(savedToken.split(".")[1])
    );
    if (exp * 1000 < Date.now()) {
      logout();
    } else {
      setToken(savedToken);
      setUser({ userId, role });
      const timeout = exp * 1000 - Date.now();
      setTimeout(logout, timeout);
    }
  }, [logout]);

  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem(
        "activeProfile",
        JSON.stringify(activeProfile)
      );
    } else {
      localStorage.removeItem("activeProfile");
    }
  }, [activeProfile]);

  const login = (newToken) => {
    const { exp, userId, role } = JSON.parse(
      atob(newToken.split(".")[1])
    );
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser({ userId, role });
    setActiveProfile(null);
    const timeout = exp * 1000 - Date.now();
    setTimeout(logout, timeout);
  };

  const addToWatchlist = async (itemId) => {
    if (!activeProfile) {
      toast.info("Selecciona primero un perfil");
      return;
    }
    try {
      const updated = await api.watchlist.add(
        activeProfile._id,
        itemId,
        token
      );
      setActiveProfile(updated);
      toast.success("Añadido a Favoritos");
    } catch {
      toast.error("No se pudo añadir a Favoritos");
    }
  };

  const removeFromWatchlist = async (itemId) => {
    if (!activeProfile) {
      toast.info("Selecciona primero un perfil");
      return;
    }
    try {
      const updated = await api.watchlist.remove(
        activeProfile._id,
        itemId,
        token
      );
      setActiveProfile(updated);
      toast.info("Eliminado de Favoritos");
    } catch {
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
