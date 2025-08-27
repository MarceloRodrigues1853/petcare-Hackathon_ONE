import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout como rota pai */}
        <Route path="/" element={<Layout />}>
          {/* Página inicial */}
          <Route index element={<Home />} />

          {/* Páginas comuns */}
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />

          {/* Perfis */}
          <Route path="profile/owner" element={<OwnerProfile />} />
          <Route path="profile/sitter" element={<SitterProfile />} />
          <Route path="profile/admin" element={<AdminProfile />} />

          {/* Autenticação */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Rota inválida → Redireciona */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
