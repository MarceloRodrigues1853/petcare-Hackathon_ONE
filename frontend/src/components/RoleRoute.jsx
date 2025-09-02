import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// allowed = ['OWNER'] | ['SITTER'] | ['ADMIN']
export default function RoleRoute({ allowed }) {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  return allowed.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
}
