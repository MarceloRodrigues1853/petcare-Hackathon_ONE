// src/components/RoleRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ allowed = [] }) {
  const { role } = useAuth();
  if (!allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
