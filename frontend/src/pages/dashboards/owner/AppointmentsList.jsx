import { ArrowLeft, Calendar, Dog } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

// 1. Importando as funções corretas do arquivo de API dedicado
import { listAppointments, deleteAppointment } from "../../../api/appointment.api.js";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setFeedback(null);
      // 2. Chamando a função de API correta e atualizada
      const data = await listAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos", error);
      setFeedback({ type: "error", message: "Não foi possível carregar os agendamentos." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id) => {
    // Adicionando uma confirmação para melhorar a experiência do usuário
    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }

    try {
      // 3. Conectando com a função de delete real da API
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      setFeedback({ type: "success", message: "Agendamento cancelado com sucesso!" });
    } catch (error) {
      setFeedback({ type: "error", message: "Erro ao cancelar o agendamento." });
    } finally {
      // Esconde a mensagem de feedback após 3 segundos
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
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

        {feedback && (
          <div
            className={`my-4 p-3 rounded-lg text-center font-medium ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Carregando agendamentos...</p>
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
              <li
                key={appt.id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-wrap justify-between items-center gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-700" title="Data do serviço">
                    <Calendar size={16} />
                    {/* 4. Corrigindo o acesso aos dados para bater com a API real */}
                    <span>{new Date(appt.dataInicio).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-700" title="Pet">
                    <Dog size={16} />
                    <span>{appt.pet?.nome || 'Não informado'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-blue-600" title="Serviço">
                    {appt.sitterServicoPreco?.servico?.descricao || 'Não informado'}
                  </span>
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm font-semibold"
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