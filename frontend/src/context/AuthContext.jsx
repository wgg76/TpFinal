<<<<<<< HEAD
// src/context/AuthContext.jsx
// @refresh reset
import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1) Inicializamos el token directamente desde localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // 2) Inicializamos el user si hay token, extrayendo userId y role (ignoramos _exp)
  const [user, setUser] = useState(() => {
    if (!token) return null;
    const { /* _exp, */ userId, role } = JSON.parse(
      atob(token.split(".")[1])
    );
    return { userId, role };
  });

  const [profiles, setProfiles] = useState([]);
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
    setProfiles([]);
    setActiveProfile(null);
  }, []);

  // 3) Efecto para programar logout automático
  useEffect(() => {
    if (!token) return;
    const { exp: _exp, userId, role } = JSON.parse(
      atob(token.split(".")[1])
    );
    // Si ya expiró, cerramos sesión
    if (_exp * 1000 < Date.now()) {
      logout();
    } else {
      // Programamos el timeout
      const timeoutMs = _exp * 1000 - Date.now();
      const timer = setTimeout(logout, timeoutMs);
      // Guardamos user en el estado
      setUser({ userId, role });
      return () => clearTimeout(timer);
    }
  }, [token, logout]);

// 4) Carga perfiles cuando cambia el token
useEffect(() => {
  if (!token) {
    setProfiles([]);
    setActiveProfile(null);
    return;
  }
  const load = async () => {
    try {
      const list = await api.profiles.list(token);
      console.log("🚀 Perfiles cargados:", list);
      setProfiles(list);

      // Si no hay perfil activo o el activo ya no está en la lista, seleccionamos el primero
      if ((!activeProfile || !list.some(p => p._id === activeProfile._id)) && list.length > 0) {
        setActiveProfile(list[0]);
      }
    } catch (err) {
      console.error("Error cargando perfiles:", err);
    }
  };
  load();
}, [token, activeProfile]);

  // 5) Persistir perfil activo en localStorage
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

  // 6) Función de login: guarda token y programa logout
  const login = (newToken) => {
    const { exp: _exp, userId, role } = JSON.parse(
      atob(newToken.split(".")[1])
    );
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser({ userId, role });
    setActiveProfile(null);
    const timeoutMs = _exp * 1000 - Date.now();
    setTimeout(logout, timeoutMs);
  };

  // 7) Watchlist
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

  // 8) CRUD de perfiles
  const createProfile = async (data) => {
    try {
      await api.profiles.create(data, token);
      const list = await api.profiles.list(token);
      setProfiles(list);
    } catch (err) {
      toast.error("Error al crear perfil");
      console.error(err);
    }
  };
  const updateProfile = async (id, data) => {
    try {
      await api.profiles.update(id, data, token);
      const list = await api.profiles.list(token);
      setProfiles(list);
      if (activeProfile?._id === id) {
        const updated = list.find((p) => p._id === id);
        setActiveProfile(updated);
      }
    } catch (err) {
      toast.error("Error al actualizar perfil");
      console.error(err);
    }
  };
  const deleteProfile = async (id) => {
    try {
      await api.profiles.remove(id, token);
      const list = await api.profiles.list(token);
      setProfiles(list);
      if (activeProfile?._id === id) setActiveProfile(null);
    } catch (err) {
      toast.error("Error al eliminar perfil");
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profiles,
        activeProfile,
        setActiveProfile,
        login,
        logout,
        addToWatchlist,
        removeFromWatchlist,
        createProfile,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
=======
// src/context/AuthContext.jsx
// @refresh reset
import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1) Inicializamos el token directamente desde localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // 2) Inicializamos el user si hay token, extrayendo userId y role (ignoramos _exp)
  const [user, setUser] = useState(() => {
    if (!token) return null;
    const { /* _exp, */ userId, role } = JSON.parse(
      atob(token.split(".")[1])
    );
    return { userId, role };
  });

  const [profiles, setProfiles] = useState([]);
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
    setProfiles([]);
    setActiveProfile(null);
  }, []);

  // 3) Efecto para programar logout automático
  useEffect(() => {
    if (!token) return;
    const { exp: _exp, userId, role } = JSON.parse(
      atob(token.split(".")[1])
    );
    // Si ya expiró, cerramos sesión
    if (_exp * 1000 < Date.now()) {
      logout();
    } else {
      // Programamos el timeout
      const timeoutMs = _exp * 1000 - Date.now();
      const timer = setTimeout(logout, timeoutMs);
      // Guardamos user en el estado
      setUser({ userId, role });
      return () => clearTimeout(timer);
    }
  }, [token, logout]);

  // 4) Carga perfiles cuando cambia el token
  useEffect(() => {
    if (!token) {
      setProfiles([]);
      setActiveProfile(null);
      return;
    }
    const load = async () => {
      try {
        const list = await api.profiles.list(token);

        setProfiles(list);

        // Si no hay perfil activo o el activo ya no está en la lista, seleccionamos el primero
        if ((!activeProfile || !list.some(p => p._id === activeProfile._id)) && list.length > 0) {
          setActiveProfile(list[0]);
        }
      } catch (err) {
        console.error("Error cargando perfiles:", err);
      }
    };
    load();
  }, [token, activeProfile]);

  // 5) Persistir perfil activo en localStorage
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

  // 6) Función de login: guarda token y programa logout
  const login = (newToken) => {
    const { exp: _exp, userId, role } = JSON.parse(
      atob(newToken.split(".")[1])
    );
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser({ userId, role });
    setActiveProfile(null);
    const timeoutMs = _exp * 1000 - Date.now();
    setTimeout(logout, timeoutMs);
  };

  // 7) Watchlist
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

  // 8) CRUD de perfiles
  const createProfile = async (data) => {
    try {
      await api.profiles.create(data, token);
      const list = await api.profiles.list(token);
      setProfiles(list);
    } catch (err) {
      toast.error("Error al crear perfil");
      console.error(err);
    }
  };
  const updateProfile = async (id, data) => {
    try {
      await api.profiles.update(id, data, token);
      const list = await api.profiles.list(token);
      setProfiles(list);
      if (activeProfile?._id === id) {
        const updated = list.find((p) => p._id === id);
        setActiveProfile(updated);
      }
    } catch (err) {
      toast.error("Error al actualizar perfil");
      console.error(err);
    }
  };
  const deleteProfile = async (id) => {
    try {
      await api.profiles.remove(id, token);
      const list = await api.profiles.list(token);
      setProfiles(list);
      if (activeProfile?._id === id) setActiveProfile(null);
    } catch (err) {
      toast.error("Error al eliminar perfil");
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profiles,
        activeProfile,
        setActiveProfile,
        login,
        logout,
        addToWatchlist,
        removeFromWatchlist,
        createProfile,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
>>>>>>> 5582115 (veamos que sale)
