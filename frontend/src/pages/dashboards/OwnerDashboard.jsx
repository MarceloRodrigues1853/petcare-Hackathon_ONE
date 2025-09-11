import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, User, Calendar, PawPrint, Dog } from "lucide-react";
import { getAppointments, getPets, getProfile } from "../../api/owner.js";

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

// Função utilitária para exibir datas no formato brasileiro
function formatDateBR(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// Função para calcular o valor total dos serviços agendados
function calculateTotal(appointments) {
  let total = 0;
  appointments.forEach((apt) => {
    if (apt.service === "Babá de Pets") total += 50;
    else if (apt.service === "Passeio") total += 55;
    else if (apt.service === "Hospedagem") total += 60;
  });
  return total;
}

export default function OwnerDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("Owner");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [appointmentsData, petsData, profileData] = await Promise.all([
          getAppointments(),
          getPets(),
          getProfile(),
        ]);
        setAppointments(appointmentsData);
        setPets(petsData);
        setOwnerName(profileData.name.split(" ")[0]); // Pega o primeiro nome
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar o seu painel...</div>;
  }

  const totalToPay = calculateTotal(appointments);

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Olá, {ownerName}!</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo(a) ao seu painel. Aqui está um resumo dos seus pets e agendamentos.
          </p>
        </header>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<PawPrint size={24} />} title="Meus Pets" value={pets.length} />
          <StatCard icon={<ClipboardList size={24} />} title="Agendamentos" value={appointments.length} />
          <StatCard icon={<User size={24} />} title="Valor a Pagar" value={`R$ ${totalToPay}`} />
        </section>

        {/* Ações rápidas */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/owner/pet/new"
              className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Dog className="text-blue-600 mb-2" size={28} />
              <span className="font-semibold text-center text-gray-700">Meus Pets</span>
            </Link>
            <Link
              to="/owner/appointments/new"
              className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Calendar className="text-blue-600 mb-2" size={28} />
              <span className="font-semibold text-center text-gray-700">Novo Agendamento</span>
            </Link>
            <Link
              to="/owner/appointments"
              className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ClipboardList className="text-blue-600 mb-2" size={28} />
              <span className="font-semibold text-center text-gray-700">Meus Agendamentos</span>
            </Link>
            <Link
              to="/owner/profile/edit"
              className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <User className="text-blue-600 mb-2" size={28} />
              <span className="font-semibold text-center text-gray-700">Editar Perfil</span>
            </Link>
          </div>
        </section>

        {/* Próximos Agendamentos */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Próximos Agendamentos</h2>
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full">
                    <Dog size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{apt.pet}</p>
                    <p className="text-sm text-gray-500">{apt.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-700">{formatDateBR(apt.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
