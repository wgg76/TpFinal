// src/components/ProfileCard.jsx
import React from "react";

export default function ProfileCard({ profile, onSelect, onEdit }) {
  const avatarUrl =
    profile.avatar ||
    `https://robohash.org/${encodeURIComponent(profile.name)}.png?size=128x128`;

  return (
    <div
      className="cursor-pointer flex flex-col items-center p-4 rounded hover:shadow-lg"
      onClick={onSelect}
    >
      <img
        src={avatarUrl}
        alt={profile.name}
        className="w-24 h-24 rounded-full mb-2 object-cover"
      />
      <span className="font-medium">{profile.name}</span>
      <button
        className="mt-2 text-sm text-blue-600 hover:underline"
        onClick={e => { e.stopPropagation(); onEdit(); }}
      >
        Editar
      </button>
    </div>
  );
}