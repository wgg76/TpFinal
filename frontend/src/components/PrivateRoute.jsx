import React, { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({
  children,
  adminOnly = false,
  skipProfileCheck = false,
}) {
  const { token, user, activeProfile } = useContext(AuthContext);
  const { pathname } = useLocation();

  // 1) Si es la landing pública, la dejamos pasar sin más
  if (pathname === "/" || pathname === "/home") {
    return children;
  }

  // 2) Guardias habituales
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!skipProfileCheck && !activeProfile) {
    return <Navigate to="/profiles" replace />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 3) Ya autenticado y con perfil si hace falta
  return children;
}
