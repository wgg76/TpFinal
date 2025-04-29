// src/utils/movieApi.js

export const fetchMovies = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/movies");
    if (!response.ok) {
      throw new Error("Error al obtener películas");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchMoviesByName = async (name) => {
  try {
    const response = await fetch("http://localhost:5000/api/movies");
    if (!response.ok) {
      throw new Error("Error al obtener películas");
    }
    const data = await response.json();
    // Asumiendo que en cada objeto la propiedad del título se llama "Title"
    return data.filter((movie) =>
      movie.Title.toLowerCase().includes(name.toLowerCase())
    );
  } catch (error) {
    throw error;
  }
};
