// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { postJson } from '../api/http.js';

const AuthCtx = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('jwt');
    const u = localStorage.getItem('user');
    return t && u ? JSON.parse(u) : null;
  });

  async function login(email, password) {
    const resp = await postJson('/auth/login', { email, password });
    // resp: { token, role, name, email }
    localStorage.setItem('jwt', resp.token);
    localStorage.setItem('user', JSON.stringify({ role: resp.role, name: resp.name, email: resp.email }));
    setUser({ role: resp.role, name: resp.name, email: resp.email });
    return resp; // retorna pra página decidir o redirecionamento
  }

  function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}