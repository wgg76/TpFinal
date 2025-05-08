// src/components/SeedButton.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SeedButton() {
  const { token, user } = useContext(AuthContext);

  // Solo admins lo verán
  if (user?.role !== "admin") return null;

  const handleSeed = async () => {
    if (!window.confirm("¿Recargar la base desde TMDB? ❗ Se borrarán datos actuales.")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/seed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error en seed");
      toast.success(json.message);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo recargar la base: " + err.message);
    }
  };

  return (
    <button
      onClick={handleSeed}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
    >
      🌱 Cargar base de API
    </button>
  );
}
