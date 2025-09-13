import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Cog, DollarSign, User, ClipboardList, History, Dog } from "lucide-react";
// CORREÇÃO: Adicionando a extensão .js explícita para ajudar o compilador a encontrar o ficheiro.
import { getSitterStats, getUpcomingAppointments } from "../../api/sitter.js";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

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
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, appointmentsData] = await Promise.all([
          getSitterStats(),
          getUpcomingAppointments(),
        ]);
        setStats(statsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Falha ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar o seu painel...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Olá, Sitter!</h1>
          <p className="text-gray-600 mt-2">Bem-vindo(a) ao seu painel. Aqui está um resumo da sua atividade.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<ClipboardList size={24} />} title="Total de Agendamentos" value={stats?.totalAppointments || 0} />
          <StatCard icon={<DollarSign size={24} />} title="Receita do Mês" value={brl.format(stats?.monthlyRevenue || 0)} />
          <StatCard icon={<User size={24} />} title="Sua Avaliação" value={`${stats?.rating || 0} / 5.0`} />
        </section>

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
                {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 border rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 text-green-700 p-3 rounded-full"><Dog size={24} /></div>
                            <div>
                                <p className="font-bold text-gray-800">{apt.clientName} - <span className="text-gray-600 font-medium">{apt.petName}</span></p>
                                <p className="text-sm text-gray-500">{apt.service}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-700">{new Date(apt.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                  ))}
              </div>
            </section>
        </main>
      </div>
    </div>
  );
}