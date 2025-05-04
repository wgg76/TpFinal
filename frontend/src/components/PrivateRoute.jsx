// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({
  children,
  skipProfileCheck = false,
  adminOnly = false,
}) {
  const { token, activeProfile, user } = useContext(AuthContext);
  const location = useLocation();

  // 1) Si no está logueado, al login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2) Si es ruta que puede saltarse el chequeo de perfil
  if (skipProfileCheck) {
    return children;
  }

  // 3) Si requiere perfil activo y no lo hay, redirige a /profiles
  if (!activeProfile) {
    return <Navigate to="/profiles" replace />;
  }

  // 4) Si es ruta solo admin y no tiene rol admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 5) Todo ok
  return children;
}
