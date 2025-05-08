<<<<<<< HEAD
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
      className="h-auto bg-cover bg-center flex flex-col items-center justify-start"
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
          <Link key={t.id} to={t.link} className="group overflow-hidden rounded-lg shadow-lg">
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
        <div className="inline-flex items-center space-x-4">
          <Link
            to="/login"
            className="inline-block bg-yellow-400 text-black px-6 py-3 rounded hover:bg-yellow-300 transition"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-400 transition"
          >
            Registrarse
          </Link>  
          </div>  
      )}      
    </section>
  );
}
=======
// src/pages/Home.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import background from "../assets/descarga.jpeg";
import { AuthContext } from "../context/AuthContext";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB = "https://api.themoviedb.org/3";

// Baraja un array y toma n elementos
function shuffleAndPick(arr, n) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

// Obtiene el trailer de YouTube para un item de TMDB
async function getTrailer(item, type) {
  const res = await fetch(
    `${TMDB}/${type}/${item.id}/videos?api_key=${TMDB_KEY}`
  );
  const { results } = await res.json();
  const trailer = results.find(
    v => v.type === "Trailer" && v.site === "YouTube"
  );
  return trailer
    ? `https://www.youtube.com/embed/${trailer.key}`
    : null;
}

export default function Home() {
  const { user } = useContext(AuthContext);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        // 1) Traer trending películas y series
        const [moviesRes, tvRes] = await Promise.all([
          fetch(`${TMDB}/trending/movie/week?api_key=${TMDB_KEY}`),
          fetch(`${TMDB}/trending/tv/week?api_key=${TMDB_KEY}`),
        ]).then(rs => Promise.all(rs.map(r => r.json())));

        const movies = moviesRes.results;
        const series = tvRes.results;

        // 2) Construir pool de candidatos y obtener sus trailers
        const pool = [
          ...shuffleAndPick(movies, 5).map(m => ({ m, type: "movie" })),
          ...shuffleAndPick(series, 5).map(s => ({ m: s, type: "tv" })),
        ];

        const withTrailers = (
          await Promise.all(
            pool.map(async ({ m, type }) => {
              const url = await getTrailer(m, type);
              if (url) {
                return {
                  id: m.id,
                  title: m.title || m.name,
                  trailerUrl: url,
                  link: type === "movie" ? `/movies/${m.id}` : `/series/${m.id}`,
                };
              }
              return null;
            })
          )
        ).filter(Boolean);

        // 3) Tomar 4 trailers finales y guardar
        setTrailers(shuffleAndPick(withTrailers, 4));
      } catch (err) {
        console.error("Error cargando trailers TMDB:", err);
      }
    }

    load();
  }, []);

  return (
    <section
      className="h-auto bg-cover bg-center flex flex-col items-center justify-start"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-5xl font-bold mb-6 text-white">
        🎬 Bienvenido a Blockbuster Online
      </h1>
      <p className="text-xl mb-8 text-white">
        Selecciona un perfil para empezar a disfrutar de nuestro catálogo.
      </p>

      {/* Grid 2×2 de trailers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 w-full max-w-4xl">
        {trailers.map(t => (
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
        <div className="inline-flex items-center space-x-4">
          <Link
            to="/login"
            className="inline-block bg-yellow-400 text-black px-6 py-3 rounded hover:bg-yellow-300 transition"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-400 transition"
          >
            Registrarse
          </Link>
        </div>
      )}
    </section>
  );
}
>>>>>>> 5582115 (veamos que sale)
