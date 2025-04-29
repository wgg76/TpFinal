// src/components/Footer.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useContext(ThemeContext);

  // Define estilos dinámicos segun tema
  const footerClasses = theme === 'dark'
    ? 'bg-[#0a0a23] text-yellow-400 py-4 text-center'
    : 'bg-white text-gray-800 py-4 text-center';

  return (
    <footer className={footerClasses}>
      <p className="text-sm">
        🎬 Blockbuster Online © {new Date().getFullYear()}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
