import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
// 1. Importando a função de API real
import { listAppointments } from '../../../api/appointment.api.js';

// Função auxiliar para obter o início da semana (Domingo)
const getStartOfWeek = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // Zera a hora para consistência
  const day = d.getDay();
  const diff = d.getDate() - day; // Domingo é 0
  return new Date(d.setDate(diff));
};

export default function AdminSchedule() {
  const [allAppointments, setAllAppointments] = useState([]); // Armazena todos os agendamentos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  // 2. useEffect agora busca TODOS os agendamentos UMA VEZ
  useEffect(() => {
    async function fetchAllAppointments() {
      try {
        setLoading(true);
        setError(null);
        const data = await listAppointments();
        setAllAppointments(data);
      } catch (err) {
        console.error("Falha ao buscar agendamentos:", err);
        setError("Não foi possível carregar o calendário de agendamentos.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllAppointments();
  }, []); // Array de dependências vazio para rodar apenas na montagem

  const weekDays = useMemo(() => {
    const start = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [currentDate]);

  const appointmentsByDay = useMemo(() => {
    const grouped = {};
    weekDays.forEach(day => {
      const dayString = day.toISOString().split('T')[0];
      // 3. A filtragem por dia agora usa o array completo 'allAppointments'
      //    e o campo correto 'dataInicio'
      grouped[dayString] = allAppointments.filter(apt => 
        apt.dataInicio.startsWith(dayString)
      );
    });
    return grouped;
  }, [allAppointments, weekDays]);

  const handlePreviousWeek = () => {
    setCurrentDate(prev => new Date(new Date(prev).setDate(prev.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => new Date(new Date(prev).setDate(prev.getDate() + 7)));
  };

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header> {/* ... Seu header ... */} </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <button onClick={handlePreviousWeek} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              Semana de {weekDays.length > 0 && weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              {' - '}
              {weekDays.length > 0 && weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </h2>
            <button onClick={handleNextWeek} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronRight size={24} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">A carregar agendamentos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {weekDays.map(day => (
                <div key={day.toISOString()} className="bg-slate-50 p-3 min-h-[150px]">
                  <div className="text-center mb-3">
                    <p className="font-semibold text-sm text-gray-600">{day.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</p>
                    <p className="text-2xl font-bold text-gray-800">{day.getDate()}</p>
                  </div>
                  <div className="space-y-2">
                    {appointmentsByDay[day.toISOString().split('T')[0]].map(apt => (
                      // 4. Corrigindo o acesso aos dados para bater com a API real
                      <div key={apt.id} className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-r-md text-xs">
                        <p className="font-bold text-blue-800">{apt.sitterServicoPreco?.servico?.descricao || 'Serviço'}</p>
                        <p className="text-gray-600">Sitter: {apt.sitter?.name || 'N/A'}</p>
                        <p className="text-gray-600">Dono: {apt.owner?.name || 'N/A'}</p>
                        <p className="text-gray-800 font-semibold mt-1">
                          {new Date(apt.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}