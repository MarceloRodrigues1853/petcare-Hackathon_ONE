import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { createAppointment } from "@/api/appointment.api.js";
import { listPets } from "@/api/pet.api.js";
import { listSitters, getSitterServices } from "@/api/sitter.api.js";

export default function AppointmentNew() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myPets, setMyPets] = useState([]);
  const [allSitters, setAllSitters] = useState([]);
  const [sitterServices, setSitterServices] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedSitterId, setSelectedSitterId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoadingInitialData(true);
        const [petsData, sittersData] = await Promise.all([
          listPets(),
          listSitters(),
        ]);
        setMyPets(Array.isArray(petsData) ? petsData : []);
        setAllSitters(Array.isArray(sittersData) ? sittersData : []);
      } catch (error) {
        setFeedback({ type: "error", message: "Erro ao carregar dados do formulário." });
      } finally {
        setLoadingInitialData(false);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedSitterId) {
      setSitterServices([]);
      setSelectedServiceId("");
      return;
    }
    async function fetchSitterServices() {
      try {
        const servicesData = await getSitterServices(selectedSitterId);
        setSitterServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (error) {
        setFeedback({ type: "error", message: "Erro ao buscar serviços do cuidador." });
      }
    }
    fetchSitterServices();
  }, [selectedSitterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id || !selectedPetId || !selectedSitterId || !selectedServiceId || !selectedDate) {
      setFeedback({ type: "error", message: "Todos os campos são obrigatórios." });
      return;
    }
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const payload = {
        owner: { id: user.id },
        pet: { id: parseInt(selectedPetId) },
        sitter: { id: parseInt(selectedSitterId) },
        sitterServicoPreco: { id: parseInt(selectedServiceId) },
        dataInicio: `${selectedDate}T12:00:00.000Z`,
        dataFim: `${selectedDate}T13:00:00.000Z`,
        status: "AGENDADO",
      };
      await createAppointment(payload);
      setFeedback({ type: "success", message: "Agendamento criado com sucesso! A redirecionar..." });
      setTimeout(() => navigate("/owner/appointments"), 2000);
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Erro ao criar agendamento." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitialData) {
    return <div className="p-8 text-center text-gray-500">A carregar formulário...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/owner/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Novo Agendamento</h1>
            <p className="text-gray-600 mt-2">Escolha o seu pet, o cuidador e o serviço desejado.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div>
            <label htmlFor="pet" className="block text-sm font-medium text-gray-700">Qual pet será atendido?</label>
            <select id="pet" name="pet" value={selectedPetId} onChange={(e) => setSelectedPetId(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
              <option value="">Selecione um dos seus pets</option>
              {myPets.map((pet) => (<option key={pet.id} value={pet.id}>{pet.nome}</option>))}
            </select>
          </div>

          <div>
            <label htmlFor="sitter" className="block text-sm font-medium text-gray-700">Qual cuidador(a) você deseja?</label>
            <select id="sitter" name="sitter" value={selectedSitterId} onChange={(e) => setSelectedSitterId(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
              <option value="">Selecione um cuidador(a)</option>
              {allSitters.map((sitter) => (<option key={sitter.id} value={sitter.id}>{sitter.name}</option>))}
            </select>
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">Qual serviço?</label>
            <select id="service" name="service" value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required disabled={!selectedSitterId || sitterServices.length === 0}>
              <option value="">{selectedSitterId ? 'Selecione um serviço' : 'Primeiro, selecione um cuidador'}</option>
              {sitterServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.descricao} - R$ {service.valor.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Escolha uma data</label>
            <input id="date" type="date" name="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
            {isSubmitting ? "A agendar..." : "Confirmar Agendamento"}
          </button>
        </form>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center font-medium ${ feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
}