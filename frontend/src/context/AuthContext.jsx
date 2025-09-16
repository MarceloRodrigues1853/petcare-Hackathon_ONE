import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/api/auth.api.js';
import { getOwnerById } from '@/api/owner.api.js';
import { getSitterById } from '@/api/sitter.api.js';
import { getUserById } from '@/api/user.api.js'; // Para o Admin

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth precisa estar dentro de um AuthProvider');
    return context;
}

export const AuthProvider = ({ children }) => {
    const [profile, setProfile] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => localStorage.getItem('jwt'));

    const fetchProfileData = useCallback(async (user) => {
        if (!user || !user.id || !user.role) return null;
        
        try {
            // Busca os dados específicos baseados no papel (role) do usuário
            if (user.role === 'OWNER') {
                const ownerData = await getOwnerById(user.id);
                // Combina dados base do usuário com dados específicos do owner (ex: lista de pets)
                return { ...user, ...ownerData }; 
            }
            if (user.role === 'SITTER') {
                const sitterData = await getSitterById(user.id);
                // Combina dados base com dados do sitter (ex: serviços, avaliações)
                return { ...user, ...sitterData };
            }
            if (user.role === 'ADMIN') {
                // Admin pode usar a rota genérica de usuário ou ter uma própria
                const adminData = await getUserById(user.id);
                return { ...user, ...adminData };
            }
            // Retorna o usuário base se não tiver um perfil específico
            return user;
        } catch (error) {
            console.error("Falha ao buscar perfil detalhado:", error);
            // Se falhar (ex: 401), a função que chamou irá tratar o logout
            throw error;
        }
    }, []);


    const initializeAuth = useCallback(async () => {
        const storedToken = localStorage.getItem('jwt');
        const userJson = localStorage.getItem('user');

        if (!storedToken || !userJson) {
            setLoading(false);
            return;
        }

        try {
            const storedUser = JSON.parse(userJson);
            // É crucial setar o token no estado ANTES de fazer a chamada de fetch
            setToken(storedToken);

            const fullProfile = await fetchProfileData(storedUser);
            
            localStorage.setItem('user', JSON.stringify(fullProfile));
            setProfile(fullProfile);
        } catch (error) {
            console.error('Sessão inválida. Limpando credenciais...', error);
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            setProfile(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    }, [fetchProfileData]);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    async function login(email, password) {
        const res = await apiLogin({ email, password });
        const loggedInToken = res?.token;
        const baseUser = res?.user ?? res;

        if (loggedInToken && baseUser?.id) {
            // 1. Salva o token no storage PRIMEIRO
            localStorage.setItem('jwt', loggedInToken);
            // 2. Atualiza o estado do token
            setToken(loggedInToken);
            // 3. AGORA, com o token já disponível para o http.js, busca o perfil completo
            const fullProfile = await fetchProfileData(baseUser);
            
            localStorage.setItem('user', JSON.stringify(fullProfile));
            setProfile(fullProfile);

            return fullProfile;
        }

        throw new Error('Email/senha incorretos ou resposta inválida do servidor.');
    }

    async function register(userData) {
        return await apiRegister(userData);
    }

    function logout() {
        try { apiLogout(); } catch (_) {}
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        setProfile(null);
        setToken(null);
    }
    
    const value = {
        profile,
        user: profile, // Mantém 'user' por compatibilidade
        token,
        isAuthenticated: !!profile,
        loading,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

