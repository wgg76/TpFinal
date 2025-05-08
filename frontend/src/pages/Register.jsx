<<<<<<< HEAD
// src/pages/Register.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// —————————————————————————————
// Esquema de validación con Yup
// —————————————————————————————
const schema = yup.object({
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

export default function Register() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  // —————————————————————————————
  // React Hook Form con Yup
  // —————————————————————————————
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Función que maneja el envío
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Error al registrarse", {
          onClose: () => window.location.reload(),
        });
        return;
      }
      toast.success("¡Registro exitoso! Ahora inicia sesión.", {
        onClose: () => window.location.reload(),
      });
      navigate("/login");
    } catch (err) {
      toast.error("Error de conexión", {
        onClose: () => window.location.reload(),
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Registrarse</h1>

        {/* ———————————————————————— */}
        {/* Email */}
        {/* ———————————————————————— */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded"
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* ———————————————————————— */}
        {/* Contraseña */}
        {/* ———————————————————————— */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full p-2 border rounded"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ———————————————————————— */}
        {/* Botones */}
        {/* ———————————————————————— */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-2 disabled:opacity-50"
        >
          {isSubmitting ? "Registrando..." : "Registrarme"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
=======
// src/pages/Register.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// —————————————————————————————
// Esquema de validación con Yup
// —————————————————————————————
const schema = yup.object({
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

export default function Register() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  // —————————————————————————————
  // React Hook Form con Yup
  // —————————————————————————————
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Función que maneja el envío
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Error al registrarse", {
          onClose: () => window.location.reload(),
        });
        return;
      }
      toast.success("¡Registro exitoso! Ahora inicia sesión.", {
        onClose: () => window.location.reload(),
      });
      navigate("/login");
    } catch (err) {
      toast.error("Error de conexión", {
        onClose: () => window.location.reload(),
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Registrarse</h1>

        {/* ———————————————————————— */}
        {/* Email */}
        {/* ———————————————————————— */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded"
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* ———————————————————————— */}
        {/* Contraseña */}
        {/* ———————————————————————— */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full p-2 border rounded"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ———————————————————————— */}
        {/* Botones */}
        {/* ———————————————————————— */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-2 disabled:opacity-50"
        >
          {isSubmitting ? "Registrando..." : "Registrarme"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
>>>>>>> 5582115 (veamos que sale)
