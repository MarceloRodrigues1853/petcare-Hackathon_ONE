// src/routes/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Usando alias

export default function PrivateRoute({ allowed, children }) {
  const { isAuthenticated, user } = useAuth();

  // 1. Verifica primeiro se o usuário está autenticado
  if (!isAuthenticated) {
    // Se não estiver, manda para o login, guardando a página que ele tentou aceder
    return <Navigate to="/login" replace />;
  }
  
  // 2. Se estiver autenticado, verifica se tem o perfil (role) correto
  const userRole = (user?.role || "").toUpperCase();
  if (allowed && !allowed.includes(userRole)) {
    // Se não tiver o perfil certo, manda para uma página de "acesso negado"
    return <Navigate to="/403" replace />;
  }
  
  // 3. Se passar em todas as verificações, mostra a página
  return children;
}