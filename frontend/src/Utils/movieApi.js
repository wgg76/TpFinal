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
