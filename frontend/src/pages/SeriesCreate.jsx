// src/pages/SeriesCreate.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import background from "../assets/fondo 2.png";

const SeriesCreate = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

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
    Type: "series"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Title || !form.Poster || !form.Plot || !form.Director) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear la serie");
      }

      toast.success("¡Serie creada exitosamente!");
      setTimeout(() => navigate("/series"), 1000);
    } catch (error) {
      console.error("❌ Error al crear la serie:", error);
      toast.error(error.message);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-white">Acceso denegado. Solo administradores pueden crear series.</p>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold mb-4">Agregar Serie</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TODOS TUS INPUTS ESTÁN PERFECTOS, LOS DEJÉ IGUAL */}
          {["Title", "Poster", "Plot", "Year", "Genre", "Director", "Writer", "Actors", "Awards"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block font-medium text-gray-700 mb-1">
                {field}
              </label>
              <input
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={`Ingrese ${field}`}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <div>
            <label htmlFor="Type" className="block font-medium text-gray-700 mb-1">
              Tipo:
            </label>
            <input
              id="Type"
              name="Type"
              value="series"
              readOnly
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between mt-3">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar Serie
            </button>
            <button
              type="button"
              onClick={() => navigate("/series")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default SeriesCreate;
