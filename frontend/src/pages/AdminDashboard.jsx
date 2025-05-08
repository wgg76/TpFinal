// src/pages/AdminDashboard.jsx

import React, { useContext, useEffect, useState } from "react";
import SeedButton from "../components/SeedButton";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  // 1) Cargar lista de usuarios al montar
  useEffect(() => {
    api.users
      .list(token)
      .then(setUsers)
      .catch(() => toast.error("Error cargando usuarios"));
  }, [token]);

  // 2) Función para alternar rol
  const toggleRole = async (user) => {
    const nuevoRol = user.role === "admin" ? "user" : "admin";
    try {
      const updated = await api.users.changeRole(user._id, nuevoRol, token);
      setUsers((prev) =>
        prev.map((u) => (u._id === updated._id ? updated : u))
      );
      toast.success(`Usuario ${user.email} ahora es ${updated.role}`);
    } catch {
      toast.error("No se pudo cambiar el rol");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      {/* Botón para recargar seed */}
      <SeedButton />

      {/* Tabla de usuarios */}
      <div className="mt-8 overflow-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleRole(u)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    {u.role === "admin" ? "Revertir a user" : "Hacer admin"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
