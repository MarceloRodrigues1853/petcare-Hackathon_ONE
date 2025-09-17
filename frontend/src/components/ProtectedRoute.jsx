import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute() {
  const { token, booting } = useAuth();

  if (booting) return <div className="p-8 text-center text-gray-500">Autenticando...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
}
