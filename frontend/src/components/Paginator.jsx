// src/components/Paginator.jsx

import React from "react";

export default function Paginator({ currentPage, totalPages, onPageChange }) {
  const prev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const next = () => currentPage < totalPages && onPageChange(currentPage + 1);

  const btnClass =
    "px-4 py-2 rounded shadow transition disabled:opacity-50 " +
    "bg-gradient-to-r from-yellow-400 to-yellow-500 " +
    "hover:from-yellow-500 hover:to-yellow-600 text-white";

  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <button
        onClick={prev}
        disabled={currentPage === 1}
        className={btnClass}
      >
        « Anterior
      </button>

      <span className="text-lg text-yellow-600">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={next}
        disabled={currentPage === totalPages}
        className={btnClass}
      >
        Siguiente »
      </button>
    </div>
  );
}
