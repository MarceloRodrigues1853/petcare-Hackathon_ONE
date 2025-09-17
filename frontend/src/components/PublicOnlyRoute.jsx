import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const getDashboardPath = (role) => {
  const r = (role || "").toUpperCase();
  if (r === "OWNER") return "/owner/dashboard";
  if (r === "SITTER") return "/sitter/dashboard";
  if (r === "ADMIN") return "/admin/dashboard";
  return "/"; // Fallback para a página inicial
};

export default function PublicOnlyRoute() {
    const { isAuthenticated, user, loading } = useAuth();

    // Espera a verificação inicial terminar
    if (loading) {
        return <div className="p-8 text-center text-gray-500">A carregar...</div>;
    }

    if (isAuthenticated) {
        // Se o usuário já está autenticado, redireciona para o seu dashboard
        const redirectTo = getDashboardPath(user?.role);
        return <Navigate to={redirectTo} replace />;
    }

    // Se não estiver autenticado, mostra a página pública (ex: Login, Register)
    return <Outlet />;
}