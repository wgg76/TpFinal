<<<<<<< HEAD
// src/pages/LoginPage.jsx

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

// 1. Definimos el esquema de validación con Yup
const loginSchema = yup.object({
  email: yup
    .string()
    .required("El email es obligatorio")
    .email("Debe ser un email válido"),
  password: yup.string().required("La contraseña es obligatoria"),
}).required();

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  // 2. Inicializamos react-hook-form con nuestro esquema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  // 3. Función onSubmit reutiliza tu lógica de fetch
  const onSubmit = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      login(data.token);
      toast.success("¡Inicio de sesión exitoso!");
      navigate("/profiles");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 sm:p-8 rounded shadow-lg w-full"
          noValidate
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
            Iniciar Sesión
          </h2>

          <div className="mb-5 sm:mb-6">
            <label htmlFor="email" className="block mb-2 text-base sm:text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="usuario@ejemplo.com"
              className={`w-full p-3 text-base sm:text-lg rounded border focus:outline-none focus:ring-2 ${
                errors.email ? "ring-red-500" : "focus:ring-blue-400"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-7 sm:mb-8">
            <label htmlFor="password" className="block mb-2 text-base sm:text-lg">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full p-3 text-base sm:text-lg rounded border focus:outline-none focus:ring-2 ${
                errors.password ? "ring-red-500" : "focus:ring-blue-400"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-lg sm:text-xl font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Validando..." : "Acceder"}
          </button>

          <p className="mt-5 sm:mt-6 text-center text-base sm:text-lg">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
=======
// src/pages/LoginPage.jsx

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

// 1. Definimos el esquema de validación con Yup
const loginSchema = yup.object({
  email: yup
    .string()
    .required("El email es obligatorio")
    .email("Debe ser un email válido"),
  password: yup.string().required("La contraseña es obligatoria"),
}).required();

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  // 2. Inicializamos react-hook-form con nuestro esquema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  // 3. Función onSubmit reutiliza tu lógica de fetch
  const onSubmit = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      login(data.token);
      toast.success("¡Inicio de sesión exitoso!");
      navigate("/profiles");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 sm:p-8 rounded shadow-lg w-full"
          noValidate
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
            Iniciar Sesión
          </h2>

          <div className="mb-5 sm:mb-6">
            <label htmlFor="email" className="block mb-2 text-base sm:text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="usuario@ejemplo.com"
              className={`w-full p-3 text-base sm:text-lg rounded border focus:outline-none focus:ring-2 ${errors.email ? "ring-red-500" : "focus:ring-blue-400"
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-7 sm:mb-8">
            <label htmlFor="password" className="block mb-2 text-base sm:text-lg">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full p-3 text-base sm:text-lg rounded border focus:outline-none focus:ring-2 ${errors.password ? "ring-red-500" : "focus:ring-blue-400"
                }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-lg sm:text-xl font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Validando..." : "Acceder"}
          </button>

          <p className="mt-5 sm:mt-6 text-center text-base sm:text-lg">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
>>>>>>> 5582115 (veamos que sale)
