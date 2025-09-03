import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ allowed = [] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const role = (user.role || '').toUpperCase();
  const ok = allowed.length === 0 || allowed.includes(role);
  return ok ? <Outlet /> : <Navigate to="/403" replace />;
}
