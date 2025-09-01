// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function OwnerDashboard() {
  return <h2>Dashboard do Dono (OWNER)</h2>;
}

function SitterDashboard() {
  return <h2>Dashboard do Cuidador (SITTER)</h2>;
}

// Rota protegida simples por token (opcionalmente também checa role)
function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/owner/dashboard"
          element={
            <PrivateRoute roles={['OWNER']}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/sitter/dashboard"
          element={
            <PrivateRoute roles={['SITTER']}>
              <SitterDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<h2>404</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
