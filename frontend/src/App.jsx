// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./styles.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";

import OwnerProfile from "./pages/profile/OwnerProfile";
import SitterProfile from "./pages/profile/SitterProfile";
import AdminProfile from "./pages/profile/AdminProfile";

// --- Guards ---
function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    // opcional: mandar para a home, ou para o perfil correto
    return <Navigate to="/" replace />;
  }

  return children;
}

// se já estiver logado, manda direto para o perfil correspondente
function RedirectIfAuthenticated({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  if (token) {
    if (role === "OWNER")  return <Navigate to="/profile/owner" replace />;
    if (role === "SITTER") return <Navigate to="/profile/sitter" replace />;
    if (role === "ADMIN")  return <Navigate to="/profile/admin" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout como rota pai */}
        <Route path="/" element={<Layout />}>
          {/* Página inicial */}
          <Route
            index
            element={
              // se estiver logado, redireciona para o perfil; senão, mostra Home normalmente
              <RedirectIfAuthenticated>
                <Home />
              </RedirectIfAuthenticated>
            }
          />

          {/* Páginas comuns */}
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />

          {/* Perfis (protegidos) */}
          <Route
            path="profile/owner"
            element={
              <PrivateRoute roles={["OWNER"]}>
                <OwnerProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="profile/sitter"
            element={
              <PrivateRoute roles={["SITTER"]}>
                <SitterProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="profile/admin"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <AdminProfile />
              </PrivateRoute>
            }
          />

          {/* Autenticação */}
          <Route
            path="login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="register"
            element={
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            }
          />

          {/* Rota inválida → Redireciona */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
