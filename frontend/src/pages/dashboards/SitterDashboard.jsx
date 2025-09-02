import { Link } from 'react-router-dom';

export default function SitterDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Olá, Sitter</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:700 }}>
        <Link className="btn" to="/sitter/services">meus serviços</Link>
        <Link className="btn" to="/sitter/profile/edit">Editar perfil</Link>
        <Link className="btn" to="/sitter/appointments">ver agendamentos</Link>
        <Link className="btn" to="/sitter/history">meu histórico</Link>
      </div>
    </div>
  );
}
