import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RoleRoute({ allowed = [] }) {
  const { profile } = useAuth();

  // se ainda não tem profile (ex.: acabou de logar e só tem token), manda pra login
  if (!profile) return <Navigate to="/login" replace />;

  if (allowed.length && !allowed.includes(profile.role)) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />;
}
