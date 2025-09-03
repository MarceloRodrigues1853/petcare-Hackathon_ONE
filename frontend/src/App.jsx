// App router (com dashboards e guardas)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import OwnerDashboard from "./pages/dashboards/OwnerDashboard";
import SitterDashboard from "./pages/dashboards/SitterDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

import PetForm from "./pages/dashboards/owner/PetForm";
import AppointmentNew from "./pages/dashboards/owner/AppointmentNew";
import AppointmentsList from "./pages/dashboards/owner/AppointmentsList";
import OwnerProfileEdit from "./pages/dashboards/owner/OwnerProfileEdit";

import ServicesForm from "./pages/dashboards/sitter/ServicesForm";
import SitterAppointments from "./pages/dashboards/sitter/SitterAppointments";
import SitterProfileEdit from "./pages/dashboards/sitter/SitterProfileEdit";

import SittersList from "./pages/dashboards/admin/SittersList";
import OwnersList from "./pages/dashboards/admin/OwnersList";
import AdminSchedule from "./pages/dashboards/admin/AdminSchedule";

import Forbidden from "./pages/Forbidden"; // 👈

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
            <Route path="403" element={<Forbidden />} /> {/* 👈 */}

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
