import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Dog } from "lucide-react";
// 1. Importando a função correta do arquivo de API de agendamentos
import { listAppointments } from "../../../api/appointment.api.js";

export default function SitterAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Todos');

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 2. Usando a função de API correta
      const data = await listAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Falha ao buscar agendamentos:", err);
      setError("Não foi possível carregar os agendamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // 3. Lógica de filtro corrigida para usar os status reais da API (ex: "AGENDADO")
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'Todos') return true;
    // O backend retorna o status em maiúsculas, ex: "AGENDADO", "CONCLUIDO"
    return apt.status.toUpperCase() === filter.toUpperCase();
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar agendamentos...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
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

        {/* Botões de Filtro com os valores corretos da API */}
        <div className="mb-6 flex space-x-2 bg-gray-200 p-1 rounded-lg">
            <button onClick={() => setFilter('Todos')} className={`w-full py-2 rounded-md font-semibold transition-colors ${filter === 'Todos' ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>Todos</button>
            <button onClick={() => setFilter('AGENDADO')} className={`w-full py-2 rounded-md font-semibold transition-colors ${filter === 'AGENDADO' ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>Agendados</button>
            <button onClick={() => setFilter('CONCLUIDO')} className={`w-full py-2 rounded-md font-semibold transition-colors ${filter === 'CONCLUIDO' ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>Concluídos</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <div key={apt.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                          <Dog size={24} />
                        </div>
                      <div>
                        {/* 4. Corrigindo o acesso aos dados para bater com a API real */}
                        <p className="font-bold text-gray-800">
                          {apt.owner?.name || 'Cliente'} - <span className="text-gray-600 font-medium">{apt.pet?.nome || 'Pet'}</span>
                        </p>
                        <p className="text-sm text-gray-500">{apt.sitterServicoPreco?.servico?.descricao || 'Serviço'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:space-x-8 w-full sm:w-auto">
                      <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar size={16} />
                          <span>{new Date(apt.dataInicio).toLocaleDateString('pt-BR')}</span>
                      </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                            apt.status === 'AGENDADO' ? 'bg-green-100 text-green-800' :
                            apt.status === 'CONCLUIDO' ? 'bg-gray-200 text-gray-700' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {apt.status?.toLowerCase() || 'Status'}
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