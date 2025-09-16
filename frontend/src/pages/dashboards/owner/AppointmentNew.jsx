import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// 1. Importando TODAS as funções de API necessárias
import { createAppointment } from "../../../api/appointment.api.js";
import { listPets } from "../../../api/pet.api.js";
import { listSitters } from "../../../api/sitter.api.js";
import { getSitterServices } from "../../../api/sitter.api.js";

export default function AppointmentNew() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados para popular os dropdowns
  const [myPets, setMyPets] = useState([]);
  const [allSitters, setAllSitters] = useState([]);
  const [sitterServices, setSitterServices] = useState([]);

  // Estados para os valores selecionados no formulário
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedSitterId, setSelectedSitterId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Estados de controle da UI
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // 2. Efeito para buscar dados iniciais (pets do dono e lista de sitters)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const [petsData, sittersData] = await Promise.all([
          listPets(),
          listSitters(),
        ]);
        setMyPets(petsData);
        setAllSitters(sittersData);
      } catch (error) {
        setFeedback({ type: "error", message: "Erro ao carregar dados do formulário." });
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // 3. Efeito para buscar os serviços de um sitter QUANDO ele for selecionado
  useEffect(() => {
    // Se nenhum sitter for selecionado, limpa a lista de serviços
    if (!selectedSitterId) {
      setSitterServices([]);
      setSelectedServiceId("");
      return;
    }

    async function fetchSitterServices() {
      try {
        const servicesData = await getSitterServices(selectedSitterId);
        setSitterServices(servicesData);
      } catch (error) {
        setFeedback({ type: "error", message: "Erro ao buscar serviços do cuidador." });
      }
    }
    fetchSitterServices();
  }, [selectedSitterId]); // Roda toda vez que o sitter selecionado mudar

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id || !selectedPetId || !selectedSitterId || !selectedServiceId || !selectedDate) {
      setFeedback({ type: "error", message: "Todos os campos são obrigatórios." });
      return;
    }

    setIsSubmitting(true);
    try {
      // 4. Montando o payload complexo que a API espera
      const payload = {
        owner: { id: user.id },
        pet: { id: parseInt(selectedPetId) },
        sitter: { id: parseInt(selectedSitterId) },
        sitterServicoPreco: { id: parseInt(selectedServiceId) },
        dataInicio: `${selectedDate}T12:00:00.000Z`, // Exemplo de data/hora
        dataFim: `${selectedDate}T13:00:00.000Z`, // Exemplo de data/hora
        status: "AGENDADO",
      };

      await createAppointment(payload);
      setFeedback({ type: "success", message: "Agendamento criado com sucesso!" });
      
      // Redireciona para a lista de agendamentos após 2 segundos
      setTimeout(() => navigate("/owner/appointments"), 2000);

    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Erro ao criar agendamento." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-8">Carregando formulário...</p>;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 relative flex items-center">
            {/* ... Seu header ... */}
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          {/* 5. Dropdown para os pets do dono */}
          <div>
            <label htmlFor="pet" className="block text-sm font-medium text-gray-700">Qual pet será atendido?</label>
            <select
              id="pet" name="pet"
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione um pet</option>
              {myPets.map((pet) => (
                <option key={pet.id} value={pet.id}>{pet.nome}</option>
              ))}
            </select>
          </div>

          {/* 6. Dropdown para os sitters */}
          <div>
            <label htmlFor="sitter" className="block text-sm font-medium text-gray-700">Qual cuidador(a) você deseja?</label>
            <select
              id="sitter" name="sitter"
              value={selectedSitterId}
              onChange={(e) => setSelectedSitterId(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione um cuidador(a)</option>
              {allSitters.map((sitter) => (
                <option key={sitter.id} value={sitter.id}>{sitter.name}</option>
              ))}
            </select>
          </div>

          {/* 7. Dropdown dinâmico para os serviços do sitter selecionado */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">Qual serviço?</label>
            <select
              id="service" name="service"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!selectedSitterId || sitterServices.length === 0} // Desabilitado se não houver sitter ou serviços
            >
              <option value="">{selectedSitterId ? 'Selecione um serviço' : 'Selecione um cuidador primeiro'}</option>
              {sitterServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.descricao} - R$ {service.valor.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
            <input
              id="date" type="date" name="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
<<<<<<< HEAD
            {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
=======
            Buscar Agendamento
>>>>>>> feature/admin-wip
          </button>
        </form>

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
      </div>
    </div>
  );
}
