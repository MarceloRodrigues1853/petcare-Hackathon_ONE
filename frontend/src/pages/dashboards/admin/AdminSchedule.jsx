import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Dog, User } from "lucide-react";

// Mock da API para simular a busca de agendamentos para uma semana
const mockAppointments = [
    // Semana atual
    { id: 101, sitterName: "Fernanda Lima", ownerName: "Ana Silva", petName: "Bolinha", service: "Passeio", dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() },
    { id: 102, sitterName: "Gustavo Mendes", ownerName: "Bruno Costa", petName: "Rex", service: "Hospedagem", dateTime: new Date(new Date().setDate(new Date().getDate())).toISOString() },
    { id: 103, sitterName: "Fernanda Lima", ownerName: "Carla Martins", petName: "Luna", service: "Babá de Pet", dateTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString() },
    // Semana passada
    { id: 104, sitterName: "Igor Almeida", ownerName: "Daniel Rocha", petName: "Toby", service: "Passeio", dateTime: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString() },
];

async function getAppointmentsForWeek(startDate) {
    console.log(`Buscando agendamentos a partir de: ${startDate.toISOString()}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula atraso de rede
    // Em uma API real, você passaria a data de início e fim para o backend
    return mockAppointments;
}

// Helper para obter o início de uma semana (Domingo)
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
};

// Componente principal do Calendário do Admin
export default function AdminSchedule() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfWeek = useMemo(() => getStartOfWeek(currentDate), [currentDate]);

    const daysOfWeek = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    }, [startOfWeek]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await getAppointmentsForWeek(startOfWeek);
                setAppointments(data);
            } catch (error) {
                console.error("Falha ao carregar agendamentos:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [startOfWeek]);

    const appointmentsByDay = useMemo(() => {
        const grouped = {};
        daysOfWeek.forEach(day => {
            grouped[day.toISOString().split('T')[0]] = [];
        });
        appointments.forEach(apt => {
            const aptDate = new Date(apt.dateTime).toISOString().split('T')[0];
            if (grouped[aptDate]) {
                grouped[aptDate].push(apt);
            }
        });
        return grouped;
    }, [appointments, daysOfWeek]);

    const changeWeek = (direction) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + (direction * 7));
            return newDate;
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                     <Link to="/admin/dashboard" className="flex items-center text-gray-500 hover:text-gray-800 mb-4">
                        <ChevronLeft size={20} className="mr-2" />
                        Voltar para o Painel
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800">Agenda Geral</h1>
                    <p className="text-gray-600 mt-2">Visualize todos os agendamentos da plataforma por semana.</p>
                </header>

                <main className="bg-white p-6 rounded-xl shadow-md">
                    {/* Controles de Navegação da Semana */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => changeWeek(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-700">
                            {startOfWeek.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button onClick={() => changeWeek(1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Grid do Calendário Semanal */}
                    <div className="grid grid-cols-1 md:grid-cols-7 border-t border-l border-gray-200">
                        {daysOfWeek.map((day) => (
                            <div key={day.toISOString()} className="border-b border-r border-gray-200 p-2 min-h-[200px]">
                                <p className="font-bold text-center text-sm text-gray-700">
                                    {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                                </p>
                                <p className="text-center text-2xl font-light text-gray-500 mb-2">
                                    {day.getDate()}
                                </p>
                                <div className="space-y-2">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-200 h-16 rounded-md"></div>
                                    ) : (
                                        appointmentsByDay[day.toISOString().split('T')[0]].map(apt => (
                                            <div key={apt.id} className="bg-blue-50 border border-blue-200 p-2 rounded-md text-xs">
                                                <p className="font-bold text-blue-800 flex items-center"><User size={12} className="mr-1"/>{apt.sitterName}</p>
                                                <p className="text-gray-600 flex items-center"><Dog size={12} className="mr-1"/>{apt.petName} ({apt.ownerName})</p>
                                                <p className="text-gray-500">{apt.service}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
