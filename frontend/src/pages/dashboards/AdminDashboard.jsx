import { useNavigate } from 'react-router-dom';
import BigButton from '../../components/BigButton';

export default function AdminDashboard() {
  const nav = useNavigate();
  return (
    <section>
      <h1>Administração</h1>
      <div style={{display:'grid', gap:24, maxWidth:900}}>
        <BigButton onClick={() => nav('/admin/schedule')}>calendário semanal</BigButton>
        <div className="grid2">
          <BigButton onClick={() => nav('/admin/sitters')}>listar Cuidadoders</BigButton>
          <BigButton onClick={() => nav('/admin/owners')}>listar donos</BigButton>
        </div>
      </div>
    </section>
  );
}
