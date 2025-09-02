// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { postJson } from '../api/http';

const AuthCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [role, setRole]   = useState(() => localStorage.getItem('role') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('email') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [role]);

  useEffect(() => {
    if (email) localStorage.setItem('email', email);
    else localStorage.removeItem('email');
  }, [email]);

  async function login(emailIn, password) {
    setLoading(true);
    try {
      const data = await postJson('/auth/login', { email: emailIn, password });
      // backend retorna { token, tokenType, email, role }
      setToken(data.token || '');
      setRole(data.role || '');
      setEmail(data.email || '');
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken('');
    setRole('');
    setEmail('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  }

  const value = { token, role, email, loading, login, logout, isAuth: !!token };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider/>');
  return ctx;
}
