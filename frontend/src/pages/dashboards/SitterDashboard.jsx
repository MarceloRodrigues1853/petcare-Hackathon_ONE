import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Calendar, Cog, User, ClipboardList, History, Dog } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// 1. Removendo a importação da função que não existe
import { listAppointments } from "@/api/appointment.api.js";

// O componente StatCard continua útil, então podemos mantê-lo para uso futuro
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

export default function SitterDashboard() {
  const { user } = useAuth();
  // 2. Removendo o estado 'stats', que não podemos mais buscar
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // 3. Buscando apenas os agendamentos, que é o dado que temos
      const appointmentsData = await listAppointments();
      setAppointments(appointmentsData);
    } catch (err) {
      console.error("Falha ao carregar dados do dashboard:", err);
      setError("Não foi possível carregar os dados do seu painel.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar o seu painel...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Olá, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-gray-600 mt-2">Bem-vindo(a) ao seu painel. Aqui está um resumo da sua atividade.</p>
        </header>

        {/* 4. Removendo a seção de estatísticas que não podem ser carregadas */}
        
        <main className="space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/sitter/services" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <Cog className="text-blue-600 mb-2" size={28} />
                <span className="font-semibold text-center text-gray-700">Meus Serviços</span>
              </Link>
              <Link to="/sitter/profile/edit" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <User className="text-blue-600 mb-2" size={28} />
                <span className="font-semibold text-center text-gray-700">Editar Perfil</span>
              </Link>
              <Link to="/sitter/appointments" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <Calendar className="text-blue-600 mb-2" size={28} />
                <span className="font-semibold text-center text-gray-700">Agendamentos</span>
              </Link>
              <Link to="/sitter/history" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <History className="text-blue-600 mb-2" size={28} />
                <span className="font-semibold text-center text-gray-700">Histórico</span>
              </Link>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Próximos Agendamentos</h2>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="p-4 border rounded-lg flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 text-green-700 p-3 rounded-full"><Dog size={24} /></div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {apt.owner?.name || 'Cliente'} - <span className="text-gray-600 font-medium">{apt.pet?.nome || 'Pet'}</span>
                        </p>
                        <p className="text-sm text-gray-500">{apt.sitterServicoPreco?.servico?.descricao || 'Serviço'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-700">{new Date(apt.dataInicio).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Você não tem nenhum agendamento futuro.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}