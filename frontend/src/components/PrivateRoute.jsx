import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false, skipProfileCheck = false }) {
  const { token, user, activeProfile } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;
  if (!skipProfileCheck && !activeProfile) return <Navigate to="/profiles" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}