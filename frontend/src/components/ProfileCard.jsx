// src/components/ProfileCard.jsx
import React from "react";

export default function ProfileCard({ profile, onSelect, onEdit, onDelete }) {
  const avatarUrl =
    profile.avatar ||
    `https://robohash.org/${encodeURIComponent(profile.name)}.png?size=128x128`;

  return (
    <div
      className="relative cursor-pointer flex flex-col items-center bg-gray-100 p-4 rounded hover:shadow-lg min-w-[120px]"
      onClick={onSelect}
    >
      {/* Botón eliminar en la esquina */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-red-100"
          title="Eliminar perfil"
        >
          🗑️
        </button>
      )}

      <img
        src={avatarUrl}
        alt={profile.name}
        className="w-24 h-24 rounded-full mb-2 object-cover"
      />
      <span className="font-medium text-center">{profile.name}</span>
      <button
        className="mt-2 text-sm text-blue-600 hover:underline"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        Editar
      </button>
    </div>
  );
}
