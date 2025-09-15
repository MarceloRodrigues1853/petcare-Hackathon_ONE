import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/api/auth.api.js';
import { getUserById } from '@/api/user.api.js';

// Cria o Contexto
const AuthContext = createContext(null);

// Hook para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro de um AuthProvider');
  }
  return context;
}

// Componente Provedor que envolve a aplicação
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Começa como 'true' para verificar a sessão

  // Função para inicializar e validar a sessão do usuário
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('jwt');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      try {
        const storedUser = JSON.parse(userJson);
        // Revalida os dados do usuário com a API para garantir que estão atualizados
        // e que o token ainda é válido.
        const freshUserData = await getUserById(storedUser.id);
        setUser(freshUserData);
      } catch (error) {
        console.error("Sessão inválida ou token expirado. Limpando...", error);
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Função de Login
  async function login(email, password) {
    const response = await apiLogin({ email, password });
    
    // A API retorna o token e o objeto do usuário completo
    if (response.token && response.user) {
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      return response;
    } else {
      throw new Error("Resposta de login inválida do servidor.");
    }
  }

  // Função de Registro
  async function register(userData) {
    await apiRegister(userData);
  }

  // Função de Logout
  function logout() {
    apiLogout(); // Limpa o JWT do localStorage
    localStorage.removeItem('user'); // Limpa também o objeto do usuário
    setUser(null); // Limpa o estado
  }

  // Valor compartilhado com toda a aplicação
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
  };
  
  // A aplicação só é renderizada após a verificação inicial da sessão terminar.
  // Isso evita "piscadas" de tela e chamadas de API com 'user.id' indefinido.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}