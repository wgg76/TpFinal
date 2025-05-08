// src/pages/SeriesForm.jsx

import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const API_BASE = import.meta.env.VITE_API_URL;

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
  imdbRating: yup
    .number()
    .typeError("El rating debe ser numérico")
    .min(0, "Rating mínimo 0")
    .max(10, "Rating máximo 10")
    .required("El rating es obligatorio"),
  imdbVotes: yup
    .number()
    .typeError("Las votaciones deben ser numéricas")
    .integer("Las votaciones deben ser un entero")
    .required("Las votaciones son obligatorias"),
  Poster: yup.string().url("Debe ser una URL válida").required("El póster es obligatorio"),
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
    defaultValues: {
      Title: "",
      imdbID: "",
      Year: "",
      imdbRating: "",
      imdbVotes: "",
      Poster: "",
    },
  });

  // carga en edición
  useEffect(() => {
    if (!editMode) return;
    (async () => {
      try {
        const data = await api.series.get(id, token);
        reset({
          Title:      data.Title || "",
          imdbID:     data._id   || "",
          Year:       data.Year   || "",
          imdbRating: data.imdbRating ?? "",
          imdbVotes:  data.imdbVotes  ?? "",
          Poster:     data.Poster || "",
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
        await api.series.update(id, formData, token);
        toast.success("Serie actualizada exitosamente");
      } else {
        await api.series.create(formData, token);
        toast.success("Serie creada exitosamente");
      }
      navigate("/series");
    } catch (err) {
      console.error(err);
      toast.error(editMode ? "Error al actualizar" : "Error al crear");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editMode ? "Editar Serie" : "Crear Nueva Serie"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1">Título:</label>
          <input {...register("Title")} className="w-full p-2 border rounded" />
          {errors.Title && <p className="text-red-500 text-sm">{errors.Title.message}</p>}
        </div>
        {/* imdbID */}
        <div>
          <label className="block mb-1">imdbID:</label>
          <input
            {...register("imdbID")}
            className="w-full p-2 border rounded"
            disabled={editMode}
          />
          {errors.imdbID && <p className="text-red-500 text-sm">{errors.imdbID.message}</p>}
        </div>
        {/* Year */}
        <div>
          <label className="block mb-1">Año:</label>
          <input {...register("Year")} className="w-full p-2 border rounded" />
          {errors.Year && <p className="text-red-500 text-sm">{errors.Year.message}</p>}
        </div>
        {/* imdbRating */}
        <div>
          <label className="block mb-1">Rating (IMDb):</label>
          <input {...register("imdbRating")} className="w-full p-2 border rounded" />
          {errors.imdbRating && <p className="text-red-500 text-sm">{errors.imdbRating.message}</p>}
        </div>
        {/* imdbVotes */}
        <div>
          <label className="block mb-1">Votos (IMDb):</label>
          <input {...register("imdbVotes")} className="w-full p-2 border rounded" />
          {errors.imdbVotes && <p className="text-red-500 text-sm">{errors.imdbVotes.message}</p>}
        </div>
        {/* Poster */}
        <div>
          <label className="block mb-1">URL del póster:</label>
          <input {...register("Poster")} className="w-full p-2 border rounded" />
          {errors.Poster && <p className="text-red-500 text-sm">{errors.Poster.message}</p>}
        </div>
        {/* botones */}
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
