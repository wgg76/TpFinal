// src/pages/Profiles.jsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import ProfileCard from "../components/ProfileCard";
import ProfileFormModal from "../components/ProfileFormModal";
import { toast } from "react-toastify";
import Background from "../assets/descarga.jpeg";

export default function Profiles() {
  const {
    token,
    setActiveProfile,
    createProfile,
    updateProfile,
    deleteProfile,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(null);

  const fetchProfiles = useCallback(async () => {
    try {
      const data = await api.profiles.list(token);
      setProfiles(data);
      if (data.length === 0) {
        setEditProfile(null);
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Error cargando perfiles:", err);
      toast.error("No se pudieron cargar los perfiles");
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchProfiles();
  }, [token, fetchProfiles]);

  const handleSubmit = async (data) => {
    try {
      if (editProfile) {
        await updateProfile(editProfile._id, data);
      } else {
        await createProfile(data);
      }
      await fetchProfiles();
      setModalOpen(false);
    } catch (err) {
      console.error("Error guardando perfil:", err);
      toast.error("No se pudo guardar el perfil");
    }
  };

  const handleSelect = (profile) => {
    setActiveProfile(profile);
    navigate("/series");
  };

  return (
    <div
      className="min-h-screen bg-black"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "140px",
        paddingBottom: "120px",
      }}
    >
      <div className="p-8 max-w-4xl mx-auto bg-white bg-opacity-80 rounded-lg mt-12 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Tus Perfiles
        </h2>

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
              onDelete={async () => {
                if (
                  window.confirm(
                    `¿Eliminar el perfil “${p.name}”?`
                  )
                ) {
                  await deleteProfile(p._id);
                  await fetchProfiles();
                }
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
    </div>
  );
}
