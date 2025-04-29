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

  const onSubmit = async data => {
    console.log("🔄 Submitting data:", data);
    try {
      let result;
      if (editMode) {
        result = await movies.updateById(id, data, token);
        toast.success("Película actualizada correctamente");
      } else {
        result = await movies.create(data, token);
        toast.success("Película creada correctamente");
      }
      console.log("✅ API result:", result);
      setTimeout(() => navigate("/movies"), 1000);
    } catch (err) {
      console.error("❌ Error al enviar formulario:", err);
      toast.error(err.message || "Error al procesar la solicitud");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
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
