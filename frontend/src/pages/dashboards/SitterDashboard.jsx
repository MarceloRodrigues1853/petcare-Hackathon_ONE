import { useNavigate } from 'react-router-dom';
import BigButton from '../../components/BigButton';

export default function SitterDashboard() {
  const nav = useNavigate();
  return (
    <section>
      <h1>Olá, Cuidador</h1>
      <div className="grid2">
        <BigButton onClick={() => nav('/sitter/services')}>meus serviços</BigButton>
        <BigButton onClick={() => nav('/sitter/profile/edit')}>Editar perfil</BigButton>
        <BigButton onClick={() => nav('/sitter/appointments')}>ver agendamentos</BigButton>
        <BigButton onClick={() => alert('histórico: a implementar')}>meu histórico</BigButton>
      </div>
    </section>
  );
}
