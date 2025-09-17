import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AuthProvider from '@/context/AuthContext.jsx';

// COMPONENTES DE ROTA
import Layout from '@/components/Layout.jsx';
// CORREÇÃO FINAL: O caminho do import foi ajustado para a sua pasta /routes/
import PrivateRoute from '@/routes/PrivateRoute.jsx'; 
import PublicOnlyRoute from '@/components/PublicOnlyRoute.jsx';


// PÁGINAS (importe todas as suas páginas aqui)
import Home from '@/pages/Home.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import SitterSearch from '@/pages/SitterSearch.jsx';
import About from '@/pages/About.jsx';
import Services from '@/pages/Services.jsx';
import Forbidden from '@/pages/Forbidden.jsx';
import AdminDashboard from '@/pages/dashboards/AdminDashboard.jsx';
import OwnerDashboard from '@/pages/dashboards/OwnerDashboard.jsx';
import SitterDashboard from '@/pages/dashboards/SitterDashboard.jsx';
// ...etc

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            
            {/* Rotas Públicas (só para quem NÃO está logado) */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Outras Rotas Públicas */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="sitters" element={<SitterSearch />} />
            <Route path="403" element={<Forbidden />} />

            {/* Rotas Protegidas de OWNER */}
            <Route 
              path="owner/dashboard" 
              element={
                <PrivateRoute allowed={['OWNER']}>
                  <OwnerDashboard />
                </PrivateRoute>
              }
            />
            {/* ... adicione as suas outras rotas protegidas da mesma forma ... */}

            {/* Rotas Protegidas de SITTER */}
            <Route 
              path="sitter/dashboard" 
              element={
                <PrivateRoute allowed={['SITTER']}>
                  <SitterDashboard />
                </PrivateRoute>
              }
            />
            {/* ... etc ... */}
            
            {/* Rotas Protegidas de ADMIN */}
            <Route 
              path="admin/dashboard" 
              element={
                <PrivateRoute allowed={['ADMIN']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            {/* ... etc ... */}


            {/* Redireciona para a home caso a rota não seja encontrada */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;