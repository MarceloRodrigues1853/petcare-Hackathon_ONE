// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth.api.js';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return context;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializa o estado de autenticação ao carregar a aplicação
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('jwt');
    const userJson = localStorage.getItem('user');
    
    // Para uma inicialização de sessão rápida e sem chamadas de API,
    // podemos confiar nos dados salvos no localStorage do último login.
    if (token && userJson) {
      try {
        setUser(JSON.parse(userJson));
      } catch (error) {
        console.error("Erro ao ler dados do usuário do localStorage", error);
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
    // A resposta esperada do backend é: { token, role, name, email }
    const response = await apiLogin({ email, password });
    
    if (response.token) {
      const userData = {
        name: response.name,
        email: response.email,
        role: response.role,
      };
      
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('user', JSON.stringify(userData)); // Salva o usuário para recarregar a página
      setUser(userData);

      return response;
    } else {
      throw new Error("Resposta de login inválida do servidor.");
    }
  }

  // Função de Registro
  async function register(userData) {
    // Não precisamos do retorno aqui, apenas que a operação seja bem-sucedida
    await apiRegister(userData);
  }

  // Função de Logout
  function logout() {
    apiLogout(); // Limpa o 'jwt' do localStorage
    localStorage.removeItem('user'); // Limpa também o usuário
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
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