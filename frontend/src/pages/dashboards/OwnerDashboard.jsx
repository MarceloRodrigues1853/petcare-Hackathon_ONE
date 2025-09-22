import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, User, Calendar, PawPrint, Dog } from "lucide-react";
import { getOwnerDashboard, getPets } from "../../api/owner.js";

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

export default function OwnerDashboard() {
  const [cards, setCards] = useState({ pets: 0, agend: 0, valor: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [ownerFirstName, setOwnerFirstName] = useState("Owner");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [dash, petsList] = await Promise.all([
          getOwnerDashboard(), // GET /owners/me/painel
          getPets(),           // GET /pets
        ]);

        setCards({
          pets: dash.totalPets ?? petsList.length ?? 0,
          agend: dash.totalAgendamentos ?? 0,
          valor: dash.valorAPagar ?? 0,
        });
        setUpcoming(dash.proximosAgendamentos ?? []);
        if (dash?.ownerName) {
          setOwnerFirstName(dash.ownerName.split(" ")[0]);
        }
      } catch (e) {
        console.error("Erro ao carregar dashboard:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar o seu painel...</div>;
  }

  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Olá, {ownerFirstName}!</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo(a) ao seu painel. Aqui está um resumo dos seus pets e agendamentos.
          </p>
        </header>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<PawPrint size={24} />} title="Meus Pets" value={cards.pets} />
          <StatCard icon={<ClipboardList size={24} />} title="Agendamentos" value={cards.agend} />
          <StatCard icon={<User size={24} />} title="Valor a Pagar" value={brl.format(cards.valor)} />
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

        {/* Próximos Agendamentos (do dashboard) */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Próximos Agendamentos</h2>
          <div className="space-y-4">
            {upcoming.length === 0 && (
              <p className="text-gray-500">Você ainda não tem agendamentos futuros.</p>
            )}
            {upcoming.map((a) => (
              <div key={a.id} className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full">
                    <Dog size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{a.petName}</p>
                    <p className="text-sm text-gray-500">{a.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-700">
                    {new Date(a.startDate).toLocaleString("pt-BR")}
                  </p>
                  {a.price != null && (
                    <p className="text-sm text-gray-500">{brl.format(a.price)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
