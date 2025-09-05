import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Dog } from "lucide-react";

const appointments = [
    { id: 1, client: 'Ana Silva', pet: 'Bolinha', service: 'Passeio', date: '2025-09-06', status: 'Confirmado' },
    { id: 2, client: 'Carlos Souza', pet: 'Rex', service: 'Hospedagem', date: '2025-09-08', status: 'Confirmado' },
    { id: 3, client: 'Mariana Lima', pet: 'Mimi', service: 'Babá de Pet', date: '2025-09-05', status: 'Concluído' },
];

export default function SitterAppointments() {
  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/sitter/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meus Agendamentos</h1>
            <p className="text-gray-600 mt-2">Veja os seus agendamentos confirmados e concluídos.</p>
          </div>
        </header>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="space-y-4">
              {appointments.map(apt => (
                  <div key={apt.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                       <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><Dog size={24} /></div>
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
                         <span className={`px-3 py-1 text-xs font-bold rounded-full ${ apt.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                            {apt.status}
                         </span>
                    </div>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}