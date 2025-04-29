// src/pages/MovieCreate.jsx
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
// Asegúrate de que el contexto esté adaptado: aquí lo llamamos MovieContext
import { MovieContext } from "../context/MovieContext";
import background from "../assets/fondo 2.png";

const MovieCreate = () => {
  const { setMovies } = useContext(MovieContext); // Usamos setMovies
  const navigate = useNavigate();

  // Inicializamos el estado con un valor por defecto para "Type"
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
    Type: "movie" // Valor predeterminado: película
  });

  // Manejador genérico para inputs y para el select
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // En el submit, validamos que los campos obligatorios estén completos
  // y que para la sección de películas, el campo Type sea "movie"
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Title || !form.Poster || !form.Plot || !form.Director) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validación: en la creación de películas el Type debe ser "movie"
    if (form.Type !== "movie") {
      toast.error("El campo 'Tipo' debe ser 'movie' en la sección de películas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Error al crear la película");
      }

      toast.success("¡Película creada con éxito!");

      // Obtiene el listado actualizado de películas
      const updatedMovies = await fetch("http://localhost:5000/api/movies").then(
        (res) => res.json()
      );
      setMovies(updatedMovies);
      navigate("/movies");
    } catch (error) {
      console.error("❌ Error al crear:", error);
      toast.error("No se pudo crear la película");
    }
  };

  return (
    <div
      className="bg-black"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        paddingTop: "140px",
        paddingBottom: "120px",
      }}
    >
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow text-black">
        <h1 className="text-2xl font-bold mb-4">Agregar película</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Título */}
          <div>
            <label htmlFor="Title" className="block font-medium text-black mb-1">
              Título:
            </label>
            <input
              id="Title"
              type="text"
              name="Title"
              value={form.Title}
              onChange={handleChange}
              placeholder="Título de la película"
              className="w-full p-2 border rounded text-black"
            />
          </div>
          
          {/* Campo URL de imagen (Póster) */}
          <div>
            <label htmlFor="Poster" className="block font-medium text-black mb-1">
              URL de imagen:
            </label>
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
          
          {/* Campo Sinopsis */}
          <div>
            <label htmlFor="Plot" className="block font-medium text-black mb-1">
              Sinopsis:
            </label>
            <textarea
              id="Plot"
              name="Plot"
              value={form.Plot}
              onChange={handleChange}
              placeholder="Escribe una sinopsis de la película"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Campo Año */}
          <div>
            <label htmlFor="Year" className="block font-medium text-black mb-1">
              Año:
            </label>
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

          {/* Campo Género */}
          <div>
            <label htmlFor="Genre" className="block font-medium text-black mb-1">
              Género:
            </label>
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

          {/* Campo Director */}
          <div>
            <label htmlFor="Director" className="block font-medium text-black mb-1">
              Director:
            </label>
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

          {/* Campo Guionista */}
          <div>
            <label htmlFor="Writer" className="block font-medium text-black mb-1">
              Guionista:
            </label>
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

          {/* Campo Actores */}
          <div>
            <label htmlFor="Actors" className="block font-medium text-black mb-1">
              Actores:
            </label>
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

          {/* Campo Premios */}
          <div>
            <label htmlFor="Awards" className="block font-medium text-black mb-1">
              Premios:
            </label>
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

          {/* Campo Tipo */}
          <div>
            <label htmlFor="Type" className="block font-medium text-black mb-1">
              Tipo:
            </label>
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
              Guardar película
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

export default MovieCreate;

