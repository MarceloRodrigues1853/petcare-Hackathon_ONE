import { ArrowLeft, Calendar, Dog } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAppointments, createAppointment } from "../../../api/owner";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Erro ao carregar agendamentos", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      // Simula remoção no backend
      await new Promise(resolve => setTimeout(resolve, 300));
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
        {/* Botão voltar */}
        <header className="mb-8 relative flex items-center">
          <Link
            to="/owner/dashboard"
            className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors"
            title="Voltar"
          >
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meus Agendamentos</h1>
            <p className="text-gray-600 mt-2">Confira o(s) agendamento(s) do(s) seu(s) pet(s)</p>
          </div>
        </header>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Lista de agendamentos */}
        {loading ? (
          <p>Carregando agendamentos...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-600">Você ainda não tem agendamentos.</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-700">
                    <Calendar size={16} />
                    <span>{new Date(appt.date).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-700">
                    <Dog size={16} />
                    <span>{appt.pet}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-blue-600">{appt.service}</span>
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