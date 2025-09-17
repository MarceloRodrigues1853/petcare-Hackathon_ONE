import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RoleRoute({ allowedRoles }) {
    const { user } = useAuth();

    // Pega o perfil do usuário e converte para maiúsculas para garantir a comparação.
    const userRole = (user?.role || "").toUpperCase();

    // Se a rota exige perfis e o perfil do usuário está na lista, permite o acesso.
    if (allowedRoles && allowedRoles.includes(userRole)) {
        // <Outlet /> é o marcador de posição para as rotas filhas (ex: <OwnerDashboard />).
        return <Outlet />;
    }
    
    // Se o usuário não tiver o perfil correto, redireciona para a página de "Acesso Negado".
    return <Navigate to="/403" replace />;
}