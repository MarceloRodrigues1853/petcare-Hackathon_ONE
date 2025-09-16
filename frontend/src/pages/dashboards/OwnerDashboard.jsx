import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, User, Calendar, PawPrint, Dog } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listAppointments } from "@/api/appointment.api.js";

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function calculateTotal(appointments) {
    return appointments.reduce((total, apt) => total + (apt.sitterServicoPreco?.valor || 0), 0);
}

function formatDateBR(dateString) {
    if (!dateString) return '-';
    try {
        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo',
        }).format(new Date(dateString));
    } catch { return dateString; }
}

export default function OwnerDashboard() {
  const { profile, logout } = useAuth(); 
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Os dados principais (nome, pets) vêm direto do contexto, sem precisar de uma nova chamada de API!
  const ownerName = profile?.name ? profile.name.split(" ")[0] : "Usuário";
  const pets = profile?.pets || [];

  const fetchAppointments = useCallback(async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // A única chamada de API necessária agora é para os agendamentos.
      const appointmentsData = await listAppointments();
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err);
      if ((err?.message || '').includes('401')) {
        setError('Sua sessão expirou. Por favor, faça login novamente.');
        // O logout do contexto limpa o storage para evitar loops de erro.
        setTimeout(logout, 3000); 
      } else {
        setError("Não foi possível carregar seus agendamentos.");
      }
    } finally {
      setLoading(false);
    }
  }, [profile?.id, logout]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Se o contexto ainda estiver carregando, mostramos uma mensagem geral.
  if (useAuth().loading) {
    return <div className="p-8 text-center text-gray-500">Autenticando...</div>;
  }
  
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const totalToPay = calculateTotal(appointments);
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Olá, {ownerName}!</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo(a) ao seu painel. Aqui está um resumo dos seus pets e agendamentos.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<PawPrint size={24} />} title="Meus Pets" value={pets.length} />
          <StatCard icon={<ClipboardList size={24} />} title="Agendamentos" value={appointments.length} />
          <StatCard icon={<User size={24} />} title="Valor a Pagar" value={brl.format(totalToPay)} />
        </section>

        {/* O restante do seu componente JSX continua igual... */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/owner/pet/new" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <Dog className="text-blue-600 mb-2" size={28} />
                <span className="font-semibold text-center text-gray-700">Meus Pets</span>
            </Link>
            <Link to="/owner/appointments/new" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <Calendar className="text-blue-600 mb-2" size={28} />
                <span className="font-semibold text-center text-gray-700">Novo Agendamento</span>
            </Link>
            <Link to="/owner/appointments" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <ClipboardList className="text-blue-600 mb-2" size={28} />
                <span className="font-semibold text-center text-gray-700">Meus Agendamentos</span>
            </Link>
            <Link to="/owner/profile/edit" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <User className="text-blue-600 mb-2" size={28} />
                <span className="font-semibold text-center text-gray-700">Editar Perfil</span>
            </Link>
            </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Próximos Agendamentos</h2>
            <div className="space-y-4">
            {loading ? <p className="text-gray-500">Carregando agendamentos...</p> : appointments.length > 0 ? (
                appointments.map((apt) => (
                <div key={apt.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                    <div className="bg-green-100 text-green-700 p-3 rounded-full"><Dog size={24} /></div>
                    <div>
                        <p className="font-bold text-gray-800">{apt.pet?.nome || 'Pet'}</p>
                        <p className="text-sm text-gray-500">{apt.sitterServicoPreco?.servico?.descricao || 'Serviço'}</p>
                    </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-gray-700">{formatDateBR(apt.dataInicio)}</p>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-500">Nenhum agendamento futuro encontrado.</p>
            )}
            </div>
        </section>

      </div>
    </div>
  );
}

