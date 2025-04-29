// src/pages/SeriesEdit.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import background from '../assets/descarga.jpeg';
import { AuthContext } from '../context/AuthContext';

const SeriesEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Estado del formulario con campo Type fijo a 'series'
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
    TotalSeasons: "",
    imdbID: "",
    Type: "series"
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos existentes para editar la serie
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${id}`, {
          method: 'GET',
          cache: 'no-store',                    // ← deshabilita caché del navegador
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Error al cargar la serie');
        }
        const data = await response.json();
        
        setForm({
          Title: data.Title || '',
          Poster: data.Poster || '',
          Plot: data.Plot || '',
          Year: data.Year || '',
          Genre: data.Genre || '',
          Director: data.Director || '',
          Writer: data.Writer || '',
          Actors: data.Actors || '',
          Awards: data.Awards || '',
          TotalSeasons: data.TotalSeasons || '',
          imdbID: data.imdbID || '',
          Type: data.Type || 'series'
        });
      } catch {
       
       toast.error('No se pudo cargar la serie');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSeries();
  }, [id, token]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Title || !form.Poster || !form.Plot || !form.Director) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Error al actualizar');
      toast.success('Serie actualizada con éxito');
      navigate('/series');
    } catch {
      
      toast.error('No se pudo actualizar la serie');
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
        paddingTop: '140px',
        paddingBottom: '120px'
      }}
    >
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow text-black">
        <h1 className="text-2xl font-bold mb-4">Editar Serie</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label htmlFor="Title" className="block font-medium text-gray-700 mb-1">Título:</label>
            <input
              id="Title"
              type="text"
              name="Title"
              value={form.Title}
              onChange={handleChange}
              placeholder="Título de la serie"
              className="w-full p-2 border rounded"
            />
          </div>
          {/* URL de póster */}
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
          {/* Sinopsis */}
          <div>
            <label htmlFor="Plot" className="block font-medium text-gray-700 mb-1">Sinopsis:</label>
            <textarea
              id="Plot"
              name="Plot"
              value={form.Plot}
              onChange={handleChange}
              placeholder="Escribe una sinopsis de la serie"
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Año */}
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
          {/* Género */}
          <div>
            <label htmlFor="Genre" className="block font-medium text-gray-700 mb-1">Género:</label>
            <input
              id="Genre"
              type="text"
              name="Genre"
              value={form.Genre}
              onChange={handleChange}
              placeholder="Género"
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Temporadas */}
          <div>
            <label htmlFor="TotalSeasons" className="block font-medium text-gray-700 mb-1">Temporadas:</label>
            <input
              id="TotalSeasons"
              type="text"
              name="TotalSeasons"
              value={form.TotalSeasons}
              onChange={handleChange}
              placeholder="Número de temporadas"
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Director */}
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
          {/* Guionista */}
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
          {/* Actores */}
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
          {/* Premios */}
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
          {/* imdbID */}
          <div>
            <label htmlFor="imdbID" className="block font-medium text-gray-700 mb-1">imdbID:</label>
            <input
              id="imdbID"
              type="text"
              name="imdbID"
              value={form.imdbID}
              onChange={handleChange}
              placeholder="ID de IMDb"
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Botones */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Actualizar Serie
            </button>
            <Link
              to="/series"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeriesEdit;