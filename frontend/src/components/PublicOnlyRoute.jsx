// src/components/PublicOnlyRoute.jsx
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const getDashboardPath = (role) => {
  const r = (role || "").toUpperCase();
  if (r === "OWNER") return "/owner/dashboard";
  if (r === "SITTER") return "/sitter/dashboard";
  if (r === "ADMIN") return "/admin/dashboard";
  return "/"; // Fallback
};

export default function PublicOnlyRoute() {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        const redirectTo = getDashboardPath(user?.role);
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}