// src/pages/SeriesForm.jsx

import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

// Esquema de validación con Yup
const schema = yup.object({
  Title: yup.string().required("El título es obligatorio"),
  imdbID: yup
    .string()
    .matches(/^tt\d+$/, "ID de IMDB inválido (ej: tt1234567)")
    .required("El imdbID es obligatorio"),
  Year: yup
    .number()
    .typeError("El año debe ser numérico")
    .integer("El año debe ser un entero")
    .required("El año es obligatorio"),
});

export default function SeriesForm({ editMode }) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { Title: "", imdbID: "", Year: "" },
  });

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (!editMode) return;
    (async () => {
      try {
        const data = await api.movies.get(id, token);
        reset({
          Title: data.Title || "",
          imdbID: data.imdbID || "",
          Year: data.Year || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la serie");
      }
    })();
  }, [editMode, id, reset, token]);

  const onSubmit = async (formData) => {
    try {
      if (editMode) {
        await api.movies.updateById(id, formData, token);
        toast.success("Serie actualizada exitosamente");
      } else {
        await api.movies.create({ ...formData, Type: "series" }, token);
        toast.success("Serie creada exitosamente");
      }
      navigate("/series");
    } catch (err) {
      console.error(err);
      toast.error(err.message || (editMode ? "Error al actualizar la serie" : "Error al crear la serie"));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editMode ? "Editar Serie" : "Crear Nueva Serie"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="Title" className="block mb-1">
            Título:
          </label>
          <input
            id="Title"
            {...register("Title")}
            className="w-full p-2 border rounded"
            placeholder="Ingrese el título de la serie"
          />
          {errors.Title && (
            <p className="text-red-500 text-sm mt-1">{errors.Title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="imdbID" className="block mb-1">
            imdbID:
          </label>
          <input
            id="imdbID"
            {...register("imdbID")}
            className="w-full p-2 border rounded"
            placeholder="Ingrese el ID de IMDB"
          />
          {errors.imdbID && (
            <p className="text-red-500 text-sm mt-1">{errors.imdbID.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="Year" className="block mb-1">
            Año:
          </label>
          <input
            id="Year"
            {...register("Year")}
            className="w-full p-2 border rounded"
            placeholder="Ingrese el año de estreno"
          />
          {errors.Year && (
            <p className="text-red-500 text-sm mt-1">{errors.Year.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {editMode ? "Actualizar Serie" : "Crear Serie"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/series")}
          className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
