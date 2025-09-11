import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

// Dados de exemplo - substitua por uma chamada à API
const mockAppointments = [
  // Semana atual (exemplo)
  { id: 1, sitterName: 'Ricardo Dorneles', ownerName: 'Marcio Silveira', service: 'Passeio', date: '2025-09-08T10:00:00' },
  { id: 2, sitterName: 'Ana Beatriz', ownerName: 'Jose Abreu', service: 'Hospedagem', date: '2025-09-09T14:00:00' },
  { id: 3, sitterName: 'Ricardo Dorneles', ownerName: 'Tatiana Oliveira', service: 'Babá de Pet', date: '2025-09-11T09:30:00' },
  // Semana seguinte
  { id: 4, sitterName: 'Fernanda Lima', ownerName: 'Beatriz Costa', service: 'Passeio', date: '2025-09-15T16:00:00' },
];

// Função auxiliar para obter o início da semana (Domingo)
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 0); // Ajustado para Domingo como início
  return new Date(d.setDate(diff));
};

export default function AdminSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // TODO: Chamar API real com base em `currentDate`
    // getAppointmentsForWeek(currentDate).then(data => setAppointments(data));
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 500);
  }, [currentDate]);

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
      grouped[dayString] = appointments.filter(apt => apt.date.startsWith(dayString));
    });
    return grouped;
  }, [appointments, weekDays]);

  const handlePreviousWeek = () => {
    setCurrentDate(prev => new Date(new Date(prev).setDate(prev.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => new Date(new Date(prev).setDate(prev.getDate() + 7)));
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Calendário Semanal</h1>
              <p className="text-gray-600 mt-2">Veja todos os agendamentos da plataforma.</p>
            </div>
          </div>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <button onClick={handlePreviousWeek} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-700">
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
            <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-gray-200 border border-gray-200">
              {weekDays.map(day => (
                <div key={day.toString()} className="bg-white p-3">
                  <div className="text-center mb-3">
                    <p className="font-semibold text-sm text-gray-600">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                    <p className="text-2xl font-bold text-gray-800">{day.getDate()}</p>
                  </div>
                  <div className="space-y-2">
                    {appointmentsByDay[day.toISOString().split('T')[0]].map(apt => (
                       <div key={apt.id} className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-r-md text-xs">
                         <p className="font-bold text-blue-800">{apt.service}</p>
                         <p className="text-gray-600">Sitter: {apt.sitterName}</p>
                         <p className="text-gray-600">Dono: {apt.ownerName}</p>
                         <p className="text-gray-800 font-semibold mt-1">
                           {new Date(apt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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

