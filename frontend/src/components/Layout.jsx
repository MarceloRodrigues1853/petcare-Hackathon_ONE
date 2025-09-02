// src/components/Layout.jsx
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { isAuth, role, logout } = useAuth();

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display:'flex', gap:16, alignItems:'center' }}>
        <Link to="/">Home</Link>
        <Link to="/about">Sobre</Link>
        <Link to="/services">Serviços</Link>
        <div style={{ marginLeft: 'auto' }}>
          {isAuth ? (
            <>
              <span style={{ marginRight: 12 }}>Role: {role || '-'}</span>
              <button onClick={logout}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>{" "}
              <Link to="/register">Registrar</Link>
            </>
          )}
        </div>
      </header>
      <hr />
      <Outlet />
    </div>
  );
}
