// src/pages/Home.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import background from "../assets/descarga.jpeg";
import { AuthContext } from "../context/AuthContext";

// Función para barajar un array y seleccionar los primeros n
function shuffleAndPick(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default function Home() {
  const { user } = useContext(AuthContext);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    fetch("/movies.withTrailers.json")
      .then((res) => res.json())
      .then((data) => {
        // Filtrar solo items con trailerUrl válido (YouTube embed)
        const withTrailer = data.filter(
          (item) => typeof item.trailerUrl === 'string' && item.trailerUrl.includes('youtube.com/embed')
        );
        // Separar películas y series
        const movies = withTrailer.filter((m) => m.Type === "movie");
        const series = withTrailer.filter((s) => s.Type === "series");
        // Seleccionar aleatoriamente 2 de cada
        const moviesPick = shuffleAndPick(movies, 2);
        const seriesPick = shuffleAndPick(series, 2);

        setTrailers([
          ...moviesPick.map((m) => ({
            id: m.imdbID,
            title: m.Title,
            trailerUrl: m.trailerUrl,
            link: `/movies/${m.imdbID}`,
          })),
          ...seriesPick.map((s) => ({
            id: s.imdbID,
            title: s.Title,
            trailerUrl: s.trailerUrl,
            link: `/series/${s.imdbID}`,
          })),
        ]);
      })
      .catch((err) => console.error("Error cargando trailers:", err));
  }, []);

  return (
    <section
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-8"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-5xl font-bold mb-6 text-white">
        🎬 Bienvenido a Blockbuster Online
      </h1>
      <p className="text-xl mb-8 text-white">
        Selecciona un perfil para empezar a disfrutar de nuestro catálogo.
      </p>

      {/* Grid 2x2 de trailers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 w-full max-w-4xl">
        {trailers.map((t) => (
          <Link
            key={t.id}
            to={t.link}
            className="group overflow-hidden rounded-lg shadow-lg"
          >
            <div className="relative pb-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={t.trailerUrl}
                title={t.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="mt-2 text-white text-center group-hover:text-yellow-400 transition">
              {t.title}
            </h3>
          </Link>
        ))}
      </div>

      {!user && (
        <Link
          to="/login"
          className="inline-block bg-yellow-400 text-black px-6 py-3 rounded hover:bg-yellow-300 transition"
        >
          Iniciar Sesión
        </Link>
      )}
    </section>
  );
}
