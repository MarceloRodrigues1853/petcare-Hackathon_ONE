import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/api/auth.api.js';
import { getUserById } from '@/api/user.api.js';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return context;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('jwt');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      try {
        const storedUser = JSON.parse(userJson);
        if (storedUser.id) {
          const freshUserData = await getUserById(storedUser.id);
          setUser(freshUserData);
        }
      } catch (error) {
        console.error("Sessão inválida. Limpando...", error);
        apiLogout();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (email, password) => {
    const response = await apiLogin({ email, password });
    if (response.token && response.id) {
      const userData = {
        id: response.id, name: response.name,
        email: response.email, role: response.role,
      };
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } else {
      throw new Error("Resposta de login inválida do servidor.");
    }
  }, []);

  const register = useCallback(async (userData) => {
    await apiRegister(userData);
    await login(userData.email, userData.password);
  }, [login]);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const value = { user, isAuthenticated: !!user, loading, login, logout, register };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}