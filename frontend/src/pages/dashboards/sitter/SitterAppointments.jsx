import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Dog } from "lucide-react";
// CORREÇÃO: Usando um caminho absoluto a partir da pasta /src para garantir que o ficheiro é encontrado.
import { getAppointments } from "../../../api/owner";

export default function SitterAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos'); // Estado para controlar o filtro

  // Busca os agendamentos quando o componente é montado
  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Falha ao buscar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  // Filtra a lista de agendamentos com base no estado do filtro
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'Todos') return true;
    return apt.status === filter;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar agendamentos...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/sitter/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meus Agendamentos</h1>
            <p className="text-gray-600 mt-2">Veja e gira os seus agendamentos.</p>
          </div>
        </header>

        {/* Botões de Filtro */}
        <div className="mb-6 flex space-x-2 bg-gray-200 p-1 rounded-lg">
            <button onClick={() => setFilter('Todos')} className={`w-full py-2 rounded-md font-semibold transition-colors ${filter === 'Todos' ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>Todos</button>
            <button onClick={() => setFilter('Confirmado')} className={`w-full py-2 rounded-md font-semibold transition-colors ${filter === 'Confirmado' ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>Confirmados</button>
            <button onClick={() => setFilter('Concluído')} className={`w-full py-2 rounded-md font-semibold transition-colors ${filter === 'Concluído' ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>Concluídos</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <div key={apt.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                       <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                          <Dog size={24} />
                        </div>
                      <div>
                        <p className="font-bold text-gray-800">{apt.client} - <span className="text-gray-600 font-medium">{apt.pet}</span></p>
                        <p className="text-sm text-gray-500">{apt.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:space-x-8">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar size={16} />
                            <span>{new Date(apt.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                         <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            apt.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                            apt.status === 'Concluído' ? 'bg-gray-200 text-gray-700' :
                            'bg-red-100 text-red-800'
                         }`}>
                            {apt.status}
                         </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhum agendamento encontrado para este filtro.</p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}