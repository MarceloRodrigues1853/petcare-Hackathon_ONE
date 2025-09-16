import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// A importação foi corrigida para usar chaves {}
import { AuthProvider } from '@/context/AuthContext.jsx';

import Layout from '@/components/Layout.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import RoleRoute from '@/components/RoleRoute.jsx';

// Páginas Públicas
import Home from '@/pages/Home.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import SitterSearch from '@/pages/SitterSearch.jsx';
// Novas páginas importadas
import About from '@/pages/About.jsx';
import Services from '@/pages/Services.jsx';
import Forbidden from '@/pages/Forbidden.jsx';

// Dashboards
import AdminDashboard from '@/pages/dashboards/AdminDashboard.jsx';
import OwnerDashboard from '@/pages/dashboards/OwnerDashboard.jsx';
import SitterDashboard from '@/pages/dashboards/SitterDashboard.jsx';

// Páginas de Admin
import OwnersList from '@/pages/dashboards/admin/OwnersList.jsx';
import SittersList from '@/pages/dashboards/admin/SittersList.jsx';
import AdminSchedule from '@/pages/dashboards/admin/AdminSchedule.jsx';

// Páginas de Owner
import PetForm from '@/pages/dashboards/owner/PetForm.jsx';
import AppointmentNew from '@/pages/dashboards/owner/AppointmentNew.jsx';
import AppointmentsList from '@/pages/dashboards/owner/AppointmentsList.jsx';
import OwnerProfileEdit from '@/pages/dashboards/owner/OwnerProfileEdit.jsx';

// Páginas de Sitter
import SitterProfileEdit from '@/pages/dashboards/sitter/SitterProfileEdit.jsx';
import ServicesForm from '@/pages/dashboards/sitter/ServicesForm.jsx';
import SitterAppointments from '@/pages/dashboards/sitter/SitterAppointments.jsx';
import SitterHistory from '@/pages/dashboards/sitter/SitterHistory.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Rotas Públicas */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="sitters" element={<SitterSearch />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="403" element={<Forbidden />} />

            {/* Rotas Protegidas */}
            <Route element={<ProtectedRoute />}>
              {/* Rotas de OWNER */}
              <Route element={<RoleRoute allowed={['OWNER']} />}>
                <Route path="owner/dashboard" element={<OwnerDashboard />} />
                <Route path="owner/pets" element={<PetForm />} />
                <Route path="owner/pet/new" element={<PetForm />} />
                <Route path="owner/pet/edit/:id" element={<PetForm />} />
                <Route path="owner/appointments" element={<AppointmentsList />} />
                <Route path="owner/appointments/new" element={<AppointmentNew />} />
                <Route path="owner/profile/edit" element={<OwnerProfileEdit />} />
              </Route>

              {/* Rotas de SITTER */}
              <Route element={<RoleRoute allowed={['SITTER']} />}>
                <Route path="sitter/dashboard" element={<SitterDashboard />} />
                <Route path="sitter/services" element={<ServicesForm />} />
                <Route path="sitter/appointments" element={<SitterAppointments />} />
                <Route path="sitter/profile/edit" element={<SitterProfileEdit />} />
                <Route path="sitter/history" element={<SitterHistory />} />
              </Route>

              {/* Rotas de ADMIN */}
              <Route element={<RoleRoute allowed={['ADMIN']} />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/sitters" element={<SittersList />} />
                <Route path="admin/owners" element={<OwnersList />} />
                <Route path="admin/schedule" element={<AdminSchedule />} />
              </Route>
            </Route>

            {/* Redireciona para a home caso a rota não seja encontrada */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

