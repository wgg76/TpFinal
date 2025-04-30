// src/pages/LoginPage.jsx

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, setActiveProfile } = useContext(AuthContext);

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1) Iniciar sesión y guardar token
      console.log("🔥 API_BASE =", API_BASE);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
      login(data.token);
      toast.success("Inicio de sesión exitoso");

      // 2) Obtener perfiles existentes
      const perfRes = await fetch(`${API_BASE}/profiles`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const perfiles = perfRes.ok ? await perfRes.json() : [];

      if (perfiles.length > 0) {
        // 3a) Si hay perfiles, activar el primero y redirigir a películas
        setActiveProfile(perfiles[0]);
        navigate("/movies");
      } else {
        // 3b) Si no, ir a crear un nuevo perfil
        navigate("/profiles/new");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="usuario@ejemplo.com"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-4"
        >
          Acceder
        </button>

        <p className="mt-4 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
