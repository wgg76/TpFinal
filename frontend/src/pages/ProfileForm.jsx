// src/pages/ProfileForm.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

// Validación de formulario con Yup
 const schema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  dob: yup
    .date()
    .typeError("Fecha de nacimiento inválida")
    .required("La fecha de nacimiento es obligatoria"),
});

export default function ProfileForm({ editMode }) {
  const { token, setActiveProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", dob: "" },
  });

  const onSubmit = async (data) => {
    try {
      // Crear perfil y activar
      const perfil = await api.profiles.create(data, token);
      setActiveProfile(perfil);
      toast.success("Perfil creado con éxito");
      navigate("/movies");
    } catch (err) {
      toast.error(err.message || "Error al crear perfil");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editMode ? "Editar Perfil" : "Nuevo Perfil"}
        </h2>

        <div className="mb-4">
          <label className="block mb-2">Nombre</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded"
            placeholder="Ingresa tu nombre"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Fecha de nacimiento</label>
          <input
            type="date"
            {...register("dob")}
            className="w-full p-2 border rounded"
          />
          {errors.dob && (
            <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-2 disabled:opacity-50"
        >
          {editMode ? "Guardar Cambios" : "Crear Perfil"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/movies")}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
