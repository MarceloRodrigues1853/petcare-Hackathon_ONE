// Dashboards (UI igual aos cards do sketch)
// src/pages/dashboards/OwnerDashboard.jsx

import { useNavigate } from 'react-router-dom';
import BigButton from '../../components/BigButton';

export default function OwnerDashboard() {
  const nav = useNavigate();
  return (
    <section>
      <h1>Olá, Dono</h1>
      <div className="grid2">
        <BigButton onClick={() => nav('/owner/pet/new')}>meu pet</BigButton>
        <BigButton onClick={() => nav('/owner/appointments/new')}>novo agendamento</BigButton>
        <BigButton onClick={() => nav('/owner/appointments')}>ver agendamentos</BigButton>
        <BigButton onClick={() => nav('/owner/profile/edit')}>Editar perfil</BigButton>
      </div>
    </section>
  );
}
