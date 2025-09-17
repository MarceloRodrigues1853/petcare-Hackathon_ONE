// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute({ allowed }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const userRole = (user?.role || "").toUpperCase();
    if (allowed && !allowed.includes(userRole)) {
        return <Navigate to="/403" replace />;
    }
    
    // Se o `allowed` não for especificado, apenas verifica se está logado.
    // Se for especificado e a role bater certo, renderiza a rota filha.
    return <Outlet />;
}