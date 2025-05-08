// src/pages/ProfileForm.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  dob: yup.date().typeError("Fecha inválida").required("La fecha es obligatoria"),
  avatar: yup.string().url("URL inválida").required("Selecciona un avatar"),
});

export default function ProfileForm({ editMode = false, initialData = {}, onSubmit }) {
  const avatarSets = ["set1", "set2", "set3", "set4", "set5"];
  const baseSeed = encodeURIComponent(initialData.name?.trim() || "user");
  const avatarOptions = avatarSets.map(
    s => `https://robohash.org/${baseSeed}.png?set=${s}&size=128x128`
  );

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editMode
      ? initialData
      : { name: "", dob: "", avatar: avatarOptions[0] },
  });

  useEffect(() => {
    if (editMode) reset(initialData);
  }, [editMode, initialData, reset]);

  const submitHandler = async data => {

    await onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {editMode ? "Editar Perfil" : "Nuevo Perfil"}
      </h2>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <div>
          <label className="block mb-2">Elige un avatar:</label>
          <div className="grid grid-cols-3 gap-2">
            {avatarOptions.map(url => (
              <label key={url} className="cursor-pointer">
                <input
                  type="radio"
                  value={url}
                  {...register("avatar")}
                  className="hidden"
                />
                <img
                  src={url}
                  alt=""
                  className={`w-16 h-16 rounded-full border-2 ${watch("avatar") === url ? "border-blue-500" : "border-transparent"
                    }`}
                />
              </label>
            ))}
          </div>
          {errors.avatar && (
            <p className="text-red-500 text-sm">{errors.avatar.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Nombre</label>
          <input
            {...register("name")}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Ingresa tu nombre"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Fecha de nacimiento</label>
          <input
            type="date"
            {...register("dob")}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.dob && (
            <p className="text-red-500 text-sm">{errors.dob.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {editMode ? "Guardar Cambios" : "Crear Perfil"}
        </button>
      </form>
    </div>
  );
}
