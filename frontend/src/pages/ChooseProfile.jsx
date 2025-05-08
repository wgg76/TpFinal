// src/pages/ChooseProfile.jsx

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function ChooseProfile() {
  const { token, activeProfile, setActiveProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/profiles`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setProfiles(await res.json());
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleSelect = (p) => {
    setActiveProfile(p);
    navigate("/movies");
  };

  if (loading) return <p className="text-center py-10">Cargando perfiles…</p>;
  if (error)
    return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Tus Perfiles</h1>
      <Link
        to="/profiles/new"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-6 inline-block"
      >
        ＋ Nuevo Perfil
      </Link>
      <ul className="space-y-4">
        {profiles.map((p) => (
          <li
            key={p._id}
            className={`p-4 bg-white rounded shadow flex justify-between items-center ${activeProfile?._id === p._id ? "border-2 border-blue-500" : ""
              }`}
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm">
                Edad: {p.age} — Tipo: {p.type}
              </p>
            </div>
            <button
              onClick={() => handleSelect(p)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Usar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
