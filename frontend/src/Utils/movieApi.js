<<<<<<< HEAD
// src/utils/movieApi.js

// Si en producción defines VITE_API_URL=https://tpfinal-7qos.onrender.com
// aquí API_BASE = "https://tpfinal-7qos.onrender.com"
// En desarrollo, si no lo defines, API_BASE = "", y fetch("/api/...") irá a localhost:5000/api/...
const API_BASE = import.meta.env.VITE_API_URL || "";

export const fetchMovies = async () => {
  const url = API_BASE
    ? `${API_BASE}/api/movies`
    : "/api/movies";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al obtener películas");
  }
  return response.json();
};

export const fetchMoviesByName = async (name) => {
  const url = API_BASE
    ? `${API_BASE}/api/movies`
    : "/api/movies";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al obtener películas");
  }
  const data = await response.json();
  return data.filter((movie) =>
    movie.Title.toLowerCase().includes(name.toLowerCase())
  );
};
=======
// src/utils/movieApi.js
const API_BASE = import.meta.env.VITE_API_URL || "";

export const fetchMovies = async () => {
  const url = API_BASE ? `${API_BASE}/api/movies` : "/api/movies";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al obtener películas");
  }
  return response.json();
};

export const fetchMoviesByName = async (name) => {
  const url = API_BASE ? `${API_BASE}/api/movies` : "/api/movies";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al obtener películas");
  }
  const data = await response.json();
  return data.filter((movie) =>
    movie.Title.toLowerCase().includes(name.toLowerCase())
  );
};
>>>>>>> 5582115 (veamos que sale)
