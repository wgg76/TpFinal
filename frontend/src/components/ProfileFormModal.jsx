<<<<<<< HEAD
// src/components/ProfileFormModal.jsx
import React from "react";
import ProfileForm from "../pages/ProfileForm";

export default function ProfileFormModal({ profile, onClose, onSubmit }) {
  const handleSuccess = async data => {
    console.log("▶️ handleSuccess data:", data);
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-md p-6">
        <button
          className="float-right text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <ProfileForm
          editMode={Boolean(profile)}
          initialData={profile || {}}
          onSubmit={handleSuccess}
        />
      </div>
    </div>
  );
}
=======
// src/components/ProfileFormModal.jsx
import React from "react";
import ProfileForm from "../pages/ProfileForm";

export default function ProfileFormModal({ profile, onClose, onSubmit }) {
  const handleSuccess = async data => {

    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-md p-6">
        <button
          className="float-right text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <ProfileForm
          editMode={Boolean(profile)}
          initialData={profile || {}}
          onSubmit={handleSuccess}
        />
      </div>
    </div>
  );
}
>>>>>>> 5582115 (veamos que sale)
