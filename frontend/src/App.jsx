import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// CONTEXTO E GUARDAS DE ROTA
import AuthProvider from '@/context/AuthContext.jsx';
import Layout from '@/components/Layout.jsx';
import PublicOnlyRoute from '@/components/PublicOnlyRoute.jsx';
import PrivateRoute from '@/routes/PrivateRoute.jsx'; // Usando o seu componente do caminho correto

// PÁGINAS PÚBLICAS
import Home from '@/pages/Home.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import SitterSearch from '@/pages/SitterSearch.jsx';
import About from '@/pages/About.jsx';
import Services from '@/pages/Services.jsx';
import Forbidden from '@/pages/Forbidden.jsx';

// PÁGINAS DE ADMIN
import AdminDashboard from '@/pages/dashboards/AdminDashboard.jsx';
import OwnersList from '@/pages/dashboards/admin/OwnersList.jsx';
import SittersList from '@/pages/dashboards/admin/SittersList.jsx';
import AdminSchedule from '@/pages/dashboards/admin/AdminSchedule.jsx';
import ServiceTypes from '@/pages/dashboards/admin/ServiceTypes.jsx';
import Approvals from '@/pages/dashboards/admin/Approvals.jsx';

// PÁGINAS DE OWNER
import OwnerDashboard from '@/pages/dashboards/OwnerDashboard.jsx';
import PetForm from '@/pages/dashboards/owner/PetForm.jsx';
import AppointmentNew from '@/pages/dashboards/owner/AppointmentNew.jsx';
import AppointmentsList from '@/pages/dashboards/owner/AppointmentsList.jsx';
import OwnerProfileEdit from '@/pages/dashboards/owner/OwnerProfileEdit.jsx';

// PÁGINAS DE SITTER
import SitterDashboard from '@/pages/dashboards/SitterDashboard.jsx';
import SitterProfileEdit from '@/pages/dashboards/sitter/SitterProfileEdit.jsx';
import ServicesForm from '@/pages/dashboards/sitter/ServicesForm.jsx';
import SitterAppointments from '@/pages/dashboards/sitter/SitterAppointments.jsx';
import SitterHistory from '@/pages/dashboards/sitter/SitterHistory.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            
            {/* Rotas Públicas (visíveis apenas para usuários NÃO logados) */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Outras Rotas Públicas (visíveis para todos) */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="sitters" element={<SitterSearch />} />
            <Route path="403" element={<Forbidden />} />

            {/* --- ROTAS PROTEGIDAS --- */}
            {/* O primeiro PrivateRoute apenas verifica se o usuário está logado */}
            <Route element={<PrivateRoute />}>

              {/* Rotas de OWNER */}
              {/* O segundo PrivateRoute verifica o perfil (role) */}
              <Route element={<PrivateRoute allowed={['OWNER']} />}>
                <Route path="owner/dashboard" element={<OwnerDashboard />} />
                <Route path="owner/pets" element={<PetForm />} />
                <Route path="owner/appointments" element={<AppointmentsList />} />
                <Route path="owner/appointments/new" element={<AppointmentNew />} />
                <Route path="owner/profile/edit" element={<OwnerProfileEdit />} />
              </Route>

              {/* Rotas de SITTER */}
              <Route element={<PrivateRoute allowed={['SITTER']} />}>
                <Route path="sitter/dashboard" element={<SitterDashboard />} />
                <Route path="sitter/services" element={<ServicesForm />} />
                <Route path="sitter/appointments" element={<SitterAppointments />} />
                <Route path="sitter/profile/edit" element={<SitterProfileEdit />} />
                <Route path="sitter/history" element={<SitterHistory />} />
              </Route>

              {/* Rotas de ADMIN */}
              <Route element={<PrivateRoute allowed={['ADMIN']} />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/sitters" element={<SittersList />} />
                <Route path="admin/owners" element={<OwnersList />} />
                <Route path="admin/schedule" element={<AdminSchedule />} />
                <Route path="admin/service-types" element={<ServiceTypes />} />
                <Route path="admin/approvals" element={<Approvals />} />
              </Route>
            </Route>

            {/* Rota para "não encontrado" */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;