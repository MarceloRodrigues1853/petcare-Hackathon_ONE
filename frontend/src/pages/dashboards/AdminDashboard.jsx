import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Administração</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:800 }}>
        <Link className="btn" to="/admin/schedule">calendário semanal</Link>
        <div />
        <Link className="btn" to="/admin/sitters">listar sitters</Link>
        <Link className="btn" to="/admin/owners">listar donos</Link>
      </div>
    </div>
  );
}
