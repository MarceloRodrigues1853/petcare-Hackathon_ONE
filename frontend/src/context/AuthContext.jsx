// Contexto de autenticação
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginApi } from '../api/auth';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole]   = useState(() => localStorage.getItem('role'));
  const [email, setEmail] = useState(() => localStorage.getItem('email'));

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('role',  data.role ?? '');
    localStorage.setItem('email', data.email ?? '');
    setToken(data.token);
    setRole(data.role ?? null);
    setEmail(data.email ?? null);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setToken(null); setRole(null); setEmail(null);
  };

  const value = useMemo(() => ({ token, role, email, login, logout }), [token, role, email]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
