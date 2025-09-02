// Login com redireciono por role
// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const data = await login(email, password);
      const r = data.role;
      if (r === 'OWNER') nav('/owner/dashboard');
      else if (r === 'SITTER') nav('/sitter/dashboard');
      else if (r === 'ADMIN') nav('/admin/dashboard');
      else nav('/');
    } catch (e2) {
      setErr(e2.message || 'Falha no login');
    }
  };

  return (
    <form onSubmit={onSubmit} className="stack">
      <h2>Entrar</h2>
      {err && <div className="error">{err}</div>}
      <input placeholder="e-mail" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
