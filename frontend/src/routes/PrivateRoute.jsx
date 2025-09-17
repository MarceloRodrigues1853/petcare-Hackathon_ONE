import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute() {
    const { isAuthenticated, loading } = useAuth();

    // Se o contexto ainda está a verificar a sessão, mostra uma mensagem de carregamento.
    // Isto é crucial para evitar redirecionamentos incorretos em recargas de página.
    if (loading) {
        return <div className="p-8 text-center text-gray-500">A autenticar...</div>;
    }

    // Se a verificação terminou e o usuário NÃO está autenticado, redireciona para o login.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Se estiver autenticado, permite o acesso às rotas filhas (que serão protegidas pelo RoleRoute).
    return <Outlet />;
}