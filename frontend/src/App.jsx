// App router (com dashboards e guardas)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// CORREÇÃO: Adicionando a extensão .jsx explícita para garantir que os ficheiros sejam encontrados.
import AuthProvider from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

import OwnerDashboard from "./pages/dashboards/OwnerDashboard.jsx";
import SitterDashboard from "./pages/dashboards/SitterDashboard.jsx";
import AdminDashboard from "./pages/dashboards/admin/AdminDashboard.jsx";

import PetForm from "./pages/dashboards/owner/PetForm.jsx";
import AppointmentNew from "./pages/dashboards/owner/AppointmentNew.jsx";
import AppointmentsList from "./pages/dashboards/owner/AppointmentsList.jsx";
import OwnerProfileEdit from "./pages/dashboards/owner/OwnerProfileEdit.jsx";

import ServicesForm from "./pages/dashboards/sitter/ServicesForm.jsx";
import SitterAppointments from "./pages/dashboards/sitter/SitterAppointments.jsx";
import SitterProfileEdit from "./pages/dashboards/sitter/SitterProfileEdit.jsx";
import SitterHistory from "./pages/dashboards/sitter/SitterHistory.jsx"; 

import SittersList from "./pages/dashboards/admin/SittersList.jsx";
import OwnersList from "./pages/dashboards/admin/OwnersList.jsx";
import AdminSchedule from "./pages/dashboards/admin/AdminSchedule.jsx";

import Forbidden from "./pages/Forbidden.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />

            {/* público */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="403" element={<Forbidden />} />

            {/* autenticado */}
            <Route element={<ProtectedRoute />}>
              {/* OWNER */}
              <Route element={<RoleRoute allowed={['OWNER']} />}>
                <Route path="owner/dashboard" element={<OwnerDashboard />} />
                <Route path="owner/pet/new" element={<PetForm />} />
                <Route path="owner/appointments/new" element={<AppointmentNew />} />
                <Route path="owner/appointments" element={<AppointmentsList />} />
                <Route path="owner/profile/edit" element={<OwnerProfileEdit />} />
              </Route>

              {/* SITTER */}
              <Route element={<RoleRoute allowed={['SITTER']} />}>
                <Route path="sitter/dashboard" element={<SitterDashboard />} />
                <Route path="sitter/services" element={<ServicesForm />} />
                <Route path="sitter/appointments" element={<SitterAppointments />} />
                <Route path="sitter/profile/edit" element={<SitterProfileEdit />} />
                <Route path="sitter/history" element={<SitterHistory />} />
              </Route>

              {/* ADMIN */}
              <Route element={<RoleRoute allowed={['ADMIN']} />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/sitters" element={<SittersList />} />
                <Route path="admin/owners" element={<OwnersList />} />
                <Route path="admin/schedule" element={<AdminSchedule />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

