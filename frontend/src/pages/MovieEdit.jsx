// src/pages/MovieEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import background from '../assets/fondo 2.png';

const MovieEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado del formulario con el campo Type
  const [form, setForm] = useState({
    Title: "",
    Poster: "",
    Plot: "",
    Year: "",
    Genre: "",
    Director: "",
    Writer: "",
    Actors: "",
    Awards: "",
    Type: "movie" // Valor por defecto
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${id}`);
        if (!response.ok) {
          throw new Error("Error al cargar la película");
        }
        const data = await response.json();
        setForm({
          Title: data.Title || "",
          Poster: data.Poster || "",
          Plot: data.Plot || "",
          Year: data.Year || "",
          Genre: data.Genre || "",
          Director: data.Director || "",
          Writer: data.Writer || "",
          Actors: data.Actors || "",
          Awards: data.Awards || "",
          Type: data.Type || "movie" // Obtener el valor actual, o por defecto "movie"
        });
      } catch {
        toast.error("No se pudo cargar la película");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Title || !form.Poster || !form.Plot || !form.Director) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validación: en el formulario de edición de películas, el Type debe ser "movie"
    if (form.Type !== "movie") {
      toast.error("El campo 'Tipo' debe ser 'movie' en este formulario.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la película");
      }
      toast.success("Película actualizada con éxito");
      navigate("/movies");
    } catch {
      toast.error("No se pudo actualizar la película");
    }
  };

  if (loading) return <p className="text-center">Cargando...</p>;

  return (
    <div
      className="bg-black"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        paddingTop: '140px',
        paddingBottom: '120px'
      }}
    >
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow text-black">
        <h1 className="text-2xl font-bold mb-4">Editar Película</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos existentes */}
          <div>
            <label htmlFor="Title" className="block font-medium text-gray-700 mb-1">Título:</label>
            <input
              id="Title"
              type="text"
              name="Title"
              value={form.Title}
              onChange={handleChange}
              placeholder="Título de la película"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="Poster" className="block font-medium text-gray-700 mb-1">URL de imagen:</label>
            <input
              id="Poster"
              type="text"
              name="Poster"
              value={form.Poster}
              onChange={handleChange}
              placeholder="Ingresa la URL del póster"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="Plot" className="block font-medium text-gray-700 mb-1">Sinopsis:</label>
            <textarea
              id="Plot"
              name="Plot"
              value={form.Plot}
              onChange={handleChange}
              placeholder="Escribe una sinopsis"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="Year" className="block font-medium text-gray-700 mb-1">Año:</label>
            <input
              id="Year"
              type="text"
              name="Year"
              value={form.Year}
              onChange={handleChange}
              placeholder="Año de estreno"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="Genre" className="block font-medium text-gray-700 mb-1">Género:</label>
            <input
              id="Genre"
              type="text"
              name="Genre"
              value={form.Genre}
              onChange={handleChange}
              placeholder="Género de la película"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="Director" className="block font-medium text-gray-700 mb-1">Director:</label>
            <input
              id="Director"
              type="text"
              name="Director"
              value={form.Director}
              onChange={handleChange}
              placeholder="Director"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="Writer" className="block font-medium text-gray-700 mb-1">Guionista:</label>
            <input
              id="Writer"
              type="text"
              name="Writer"
              value={form.Writer}
              onChange={handleChange}
              placeholder="Guionista"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="Actors" className="block font-medium text-gray-700 mb-1">Actores:</label>
            <input
              id="Actors"
              type="text"
              name="Actors"
              value={form.Actors}
              onChange={handleChange}
              placeholder="Actores principales"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="Awards" className="block font-medium text-gray-700 mb-1">Premios:</label>
            <input
              id="Awards"
              type="text"
              name="Awards"
              value={form.Awards}
              onChange={handleChange}
              placeholder="Premios obtenidos"
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Campo Tipo: Se muestra un select, pero en películas se espera "movie" */}
          <div>
            <label htmlFor="Type" className="block font-medium text-gray-700 mb-1">Tipo:</label>
            <select
              id="Type"
              name="Type"
              value={form.Type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="movie">Película</option>
              <option value="series">Serie</option>
            </select>
          </div>
          <div className="flex justify-between mt-3">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar Película
            </button>
            <Link
              to="/movies"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieEdit;
