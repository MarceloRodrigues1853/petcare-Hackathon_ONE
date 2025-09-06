import { Calendar, Dog, DollarSign, User, ClipboardList, History, Cog } from 'lucide-react';

// Dados de exemplo que viriam da sua API no futuro
const upcomingAppointments = [
  { id: 1, petName: 'Bolinha', service: 'Passeio', date: '05/09', time: '14:00' },
  { id: 2, petName: 'Rex', service: 'Hospedagem', date: '07/09', time: '10:00' },
  { id: 3, petName: 'Luna', service: 'Babá de Pet', date: '08/09', time: '09:00' },
];

const stats = {
  activeServices: 3,
  monthlyRevenue: 450.00,
  nextAppointmentDays: 1,
};

export default function SitterDashboard() {
  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Olá, Sitter!</h1>
          <p className="text-slate-600 mt-1">Bem-vindo(a) ao seu painel. Aqui está um resumo da sua atividade.</p>
        </header>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Próximo Agendamento</p>
              <p className="text-xl font-bold">{stats.nextAppointmentDays} dia(s)</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Dog className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Serviços Ativos</p>
              <p className="text-xl font-bold">{stats.activeServices}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Rendimento (Mês)</p>
              <p className="text-xl font-bold">R$ {stats.monthlyRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Ações Principais */}
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-700">Ações Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="/sitter/services" className="bg-white p-4 rounded-xl shadow-md text-center hover:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-2">
                    <Cog className="h-6 w-6 text-indigo-600" />
                    <span className="font-medium text-sm">Meus Serviços</span>
                </a>
                <a href="/sitter/profile/edit" className="bg-white p-4 rounded-xl shadow-md text-center hover:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-2">
                    <User className="h-6 w-6 text-indigo-600" />
                    <span className="font-medium text-sm">Editar Perfil</span>
                </a>
                <a href="/sitter/appointments" className="bg-white p-4 rounded-xl shadow-md text-center hover:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-2">
                    <ClipboardList className="h-6 w-6 text-indigo-600" />
                    <span className="font-medium text-sm">Agendamentos</span>
                </a>
                <a href="/sitter/history" className="bg-white p-4 rounded-xl shadow-md text-center hover:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-2">
                    <History className="h-6 w-6 text-indigo-600" />
                    <span className="font-medium text-sm">Meu Histórico</span>
                </a>
            </div>
        </div>

        {/* Próximos Agendamentos */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-700">Próximos Agendamentos</h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <ul className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => (
                  <li key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Dog className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{app.petName}</p>
                        <p className="text-sm text-slate-500">{app.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{app.date}</p>
                      <p className="text-sm text-slate-500">{app.time}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">Nenhum agendamento futuro.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
