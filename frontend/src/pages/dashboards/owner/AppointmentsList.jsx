import { ArrowLeft, Calendar, Dog } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteAppointment } from "@/api/appointment.api.js";
import { getMyAppointments } from "@/api/owner.api.js"; // <-- Usando a nova função

export default function AppointmentsList() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setFeedback(null);
      const data = await getMyAppointments(user.id); // <-- Chamada corrigida
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar agendamentos", error);
      setFeedback({ type: "error", message: "Não foi possível carregar os agendamentos." });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      setFeedback({ type: "success", message: "Agendamento cancelado!" });
    } catch (error) {
      setFeedback({ type: "error", message: "Erro ao cancelar agendamento." });
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/owner/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meus Agendamentos</h1>
            <p className="text-gray-600 mt-2">Confira o(s) agendamento(s) do(s) seu(s) pet(s)</p>
          </div>
        </header>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center font-medium ${ feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`}>
            {feedback.message}
          </div>
        )}

        {loading ? (
          <p>Carregando agendamentos...</p>
        ) : appointments.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Nenhum agendamento encontrado</h2>
            <p className="text-gray-500 mt-2">Parece que você ainda não tem nenhum serviço agendado.</p>
            <Link to="/owner/appointments/new" className="mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              Agendar um serviço
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appt) => (
              <li key={appt.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-700">
                    <Calendar size={16} />
                    <span>{new Date(appt.dataInicio).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-700">
                    <Dog size={16} />
                    <span>{appt.pet?.nome || 'Pet não informado'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-blue-600">
                    {appt.sitterServicoPreco?.servico?.descricao || 'Serviço não informado'}
                  </span>
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}