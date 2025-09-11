// App router (com dashboards e guardas)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// CORREÇÃO: Utilizando caminhos absolutos a partir da raiz do projeto ('/src') para garantir a resolução correta dos módulos.
import AuthProvider from "/src/context/AuthContext.jsx";
import Layout from "/src/components/Layout.jsx";

import Home from "/src/pages/Home.jsx";
import About from "/src/pages/About.jsx";
import Services from "/src/pages/Services.jsx";
import Login from "/src/pages/Login.jsx";
import Register from "/src/pages/Register.jsx";

import ProtectedRoute from "/src/components/ProtectedRoute.jsx";
import RoleRoute from "/src/components/RoleRoute.jsx";

import OwnerDashboard from "/src/pages/dashboards/OwnerDashboard.jsx";
import SitterDashboard from "/src/pages/dashboards/SitterDashboard.jsx";
import AdminDashboard from "/src/pages/dashboards/AdminDashboard.jsx";

import SittersList from "/src/pages/dashboards/admin/SittersList.jsx";
import OwnersList from "/src/pages/dashboards/admin/OwnersList.jsx";
import AdminSchedule from "/src/pages/dashboards/admin/AdminSchedule.jsx";

import PetForm from "/src/pages/dashboards/owner/PetForm.jsx";
import AppointmentNew from "/src/pages/dashboards/owner/AppointmentNew.jsx";
import AppointmentsList from "/src/pages/dashboards/owner/AppointmentsList.jsx";
import OwnerProfileEdit from "/src/pages/dashboards/owner/OwnerProfileEdit.jsx";

import ServicesForm from "/src/pages/dashboards/sitter/ServicesForm.jsx";
import SitterAppointments from "/src/pages/dashboards/sitter/SitterAppointments.jsx";
import SitterProfileEdit from "/src/pages/dashboards/sitter/SitterProfileEdit.jsx";
import SitterHistory from "/src/pages/dashboards/sitter/SitterHistory.jsx"; 

import Forbidden from "/src/pages/Forbidden.jsx";

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

