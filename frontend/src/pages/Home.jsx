// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import background from "../assets/descarga.jpeg";

export default function Home() {
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
      <Link
        to="/login"
        className="inline-block bg-yellow-400 text-black px-6 py-3 rounded hover:bg-yellow-300 transition"
      >
        Iniciar Sesion
      </Link>
    </section>
  );
}
