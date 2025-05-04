import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import ProfileCard from "../components/ProfileCard";
import ProfileFormModal from "../components/ProfileFormModal";

export default function Profiles() {
  const { token, setActiveProfile, createProfile, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(null);

  // Carga los perfiles desde la API y auto-abrir modal si no hay perfiles
  const fetchProfiles = async () => {
    try {
      const data = await api.profiles.list(token);
      setProfiles(data);
      // Si no hay perfiles, abrimos modal para crear el primero
      if (data.length === 0) {
        setEditProfile(null);
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Error cargando perfiles:", err);
    }
  };

  // Al montar o cambiar token, carga perfiles
  useEffect(() => {
    if (token) fetchProfiles();
  }, [token]);

  // Manejador de creación o actualización de perfil
  const handleSubmit = async (data) => {
    console.log("▶️ ProfileForm submitHandler data:", data);
    try {
      if (editProfile) {
        await updateProfile(editProfile._id, data);
      } else {
        await createProfile(data);
      }
      // Refrescamos la lista (que a su vez decidirá si reabrir modal)
      await fetchProfiles();
      // Cerramos modal
      setModalOpen(false);
    } catch (err) {
      console.error("Error guardando perfil:", err);
    }
  };

  // Al seleccionar perfil, establecer y navegar a Series
  const handleSelect = (profile) => {
    setActiveProfile(profile);
    navigate("/series");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Tus Perfiles</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {profiles.map((p) => (
          <ProfileCard
            key={p._id}
            profile={p}
            onSelect={() => handleSelect(p)}
            onEdit={() => {
              setEditProfile(p);
              setModalOpen(true);
            }}
          />
        ))}

        {profiles.length < 5 && (
          <button
            className="flex flex-col items-center justify-center border-2 border-dashed rounded p-4 hover:border-gray-400"
            onClick={() => {
              setEditProfile(null);
              setModalOpen(true);
            }}
          >
            + Añadir Perfil
          </button>
        )}
      </div>

      {modalOpen && (
        <ProfileFormModal
          profile={editProfile}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
