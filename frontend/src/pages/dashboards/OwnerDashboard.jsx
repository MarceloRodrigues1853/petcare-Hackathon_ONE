import { Link } from 'react-router-dom';

export default function OwnerDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Olá, Dono(a)</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:700 }}>
        <Link className="btn" to="/owner/pet/new">meu pet</Link>
        <Link className="btn" to="/owner/appointments/new">novo agendamento</Link>
        <Link className="btn" to="/owner/appointments">ver agendamentos</Link>
        <Link className="btn" to="/owner/profile/edit">Editar perfil</Link>
      </div>
    </div>
  );
}
