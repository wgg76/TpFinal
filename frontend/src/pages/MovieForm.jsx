<<<<<<< HEAD
// src/pages/MovieForm.jsx

import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { movies } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// Schema de validación con Yup
const currentYear = new Date().getFullYear();
const schema = yup.object({
  Title: yup.string().required("El título es obligatorio"),
  imdbID: yup.string().matches(/^tt\d+$/, "ID de IMDB inválido (ej: tt1234567)").required("El imdbID es obligatorio"),
  Year: yup.number().typeError("El año debe ser un número").min(1888, "El año debe ser ≥ 1888").max(currentYear, `El año no puede superar ${currentYear}`).required("El año es obligatorio"),
  Type: yup.string().oneOf(["movie"], "Tipo inválido").required(),
}).required();

export default function MovieForm({ editMode }) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { Title: "", imdbID: "", Type: "movie", Year: "" }
  });

  useEffect(() => {
    if (editMode && id) {
      movies.get(id, token)
        .then(data => {
          reset({ Title: data.Title, imdbID: data.imdbID, Type: data.Type, Year: data.Year });
        })
        .catch(err => toast.error(err.message));
    }
  }, [editMode, id, token, reset]);

  const onSubmit = async (data) => {
    try {
      if (editMode) {
        await movies.updateById(id, data, token);
        toast.success("Película actualizada correctamente");
      } else {
        await movies.create(data, token);
        toast.success("Película creada correctamente");
      }
      // Navegar al listado de películas
      navigate("/movies");
    } catch (err) {
      toast.error(err.message || "Error al procesar la solicitud");
    }
  };
  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        {editMode ? "Editar Película" : "Crear Nueva Película"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Título</label>
          <input {...register("Title")} placeholder="Ingrese el título de la película" className="w-full p-2 border rounded" />
          {errors.Title && <p className="text-red-500 text-sm mt-1">{errors.Title.message}</p>}
        </div>

        <div>
          <label className="block mb-1">imdbID</label>
          <input {...register("imdbID")} placeholder="Ingrese el ID de IMDB" className="w-full p-2 border rounded" />
          {errors.imdbID && <p className="text-red-500 text-sm mt-1">{errors.imdbID.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Año</label>
          <input {...register("Year")} type="number" placeholder="Ingrese el año de estreno" className="w-full p-2 border rounded" />
          {errors.Year && <p className="text-red-500 text-sm mt-1">{errors.Year.message}</p>}
        </div>

        {/* Hidden field para Type */}
        <input type="hidden" {...register("Type")} />

        <div className="flex justify-between gap-4">
          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {editMode ? "Actualizar Película" : "Crear Película"}
          </button>

          <button type="button" onClick={() => navigate("/movies")} className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop pauseOnHover theme="dark" />
    </div>
  );
}
=======
// src/pages/MovieForm.jsx

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
  Poster: yup
    .string()
    .url("Debe ser una URL válida")
    .required("La URL del póster es obligatoria"),
});

export default function MovieForm({ editMode }) {
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

  // Carga datos en modo edición
  useEffect(() => {
    if (!editMode) return;
    (async () => {
      try {
        const data = await api.movies.get(id, token);
        reset({
          Title: data.Title || "",
          imdbID: data._id || "",
          Year: data.Year || "",
          imdbRating: data.imdbRating ?? "",
          imdbVotes: data.imdbVotes ?? "",
          Poster: data.Poster || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la película");
      }
    })();
  }, [editMode, id, reset, token]);

  const onSubmit = async (formData) => {
    try {
      if (editMode) {

        await api.movies.update(id, formData, token);
        toast.success("Película actualizada exitosamente");
      } else {
        // For create, backend expects _id = imdbID
        const payload = {
          _id: formData.imdbID,
          Title: formData.Title,
          Year: formData.Year,
          imdbRating: formData.imdbRating,
          imdbVotes: formData.imdbVotes,
          Poster: formData.Poster,
        };
        await api.movies.create(payload, token);
        toast.success("Película creada exitosamente");
      }
      navigate("/movies");
    } catch (err) {
      console.error(err);
      toast.error(
        err.message ||
        (editMode
          ? "Error al actualizar la película"
          : "Error al crear la película")
      );
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editMode ? "Editar Película" : "Crear Nueva Película"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Título */}
        <div>
          <label htmlFor="Title" className="block mb-1">Título:</label>
          <input
            id="Title"
            {...register("Title")}
            className="w-full p-2 border rounded"
            placeholder="Título de la película"
          />
          {errors.Title && (
            <p className="text-red-500 text-sm mt-1">{errors.Title.message}</p>
          )}
        </div>

        {/* imdbID */}
        <div>
          <label htmlFor="imdbID" className="block mb-1">imdbID:</label>
          <input
            id="imdbID"
            {...register("imdbID")}
            className="w-full p-2 border rounded"
            placeholder="tt1234567"
            disabled={editMode}
          />
          {errors.imdbID && (
            <p className="text-red-500 text-sm mt-1">{errors.imdbID.message}</p>
          )}
        </div>

        {/* Año */}
        <div>
          <label htmlFor="Year" className="block mb-1">Año:</label>
          <input
            id="Year"
            {...register("Year")}
            className="w-full p-2 border rounded"
            placeholder="1994"
          />
          {errors.Year && (
            <p className="text-red-500 text-sm mt-1">{errors.Year.message}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="imdbRating" className="block mb-1">Rating (IMDb):</label>
          <input
            id="imdbRating"
            {...register("imdbRating")}
            className="w-full p-2 border rounded"
            placeholder="8.7"
          />
          {errors.imdbRating && (
            <p className="text-red-500 text-sm mt-1">{errors.imdbRating.message}</p>
          )}
        </div>

        {/* Votos */}
        <div>
          <label htmlFor="imdbVotes" className="block mb-1">Votos (IMDb):</label>
          <input
            id="imdbVotes"
            {...register("imdbVotes")}
            className="w-full p-2 border rounded"
            placeholder="28245"
          />
          {errors.imdbVotes && (
            <p className="text-red-500 text-sm mt-1">{errors.imdbVotes.message}</p>
          )}
        </div>

        {/* Poster */}
        <div>
          <label htmlFor="Poster" className="block mb-1">URL del póster:</label>
          <input
            id="Poster"
            {...register("Poster")}
            className="w-full p-2 border rounded"
            placeholder="https://..."
          />
          {errors.Poster && (
            <p className="text-red-500 text-sm mt-1">{errors.Poster.message}</p>
          )}
        </div>

        {/* Botones */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {editMode ? "Actualizar Película" : "Crear Película"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/movies")}
          className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
>>>>>>> 5582115 (veamos que sale)
