// src/pages/owner/AppointmentNew.jsx
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { listPets, listSitters, listSitterServices, createOwnerAppointment } from "../../../api/owner";

export default function AppointmentNew() {
  const [pets, setPets] = useState([]);
  const [sitters, setSitters] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    petId: "",
    sitterId: "",
    sitterServicoPrecoId: "",
    startDate: "",
  });

  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([listPets(), listSitters("ACTIVE")]);
        setPets(p || []);
        setSitters(s || []);
      } catch (e) {
        console.error(e);
        setFeedback({ type: "error", message: "Falha ao carregar dados iniciais." });
      }
    })();
  }, []);

  // ao trocar de sitter, recarrega serviços
  useEffect(() => {
    async function loadServices() {
      if (!form.sitterId) {
        setServices([]);
        setForm((prev) => ({ ...prev, sitterServicoPrecoId: "" }));
        return;
      }
      try {
        const ss = await listSitterServices(form.sitterId);
        setServices(ss || []);
      } catch (e) {
        console.error(e);
        setFeedback({ type: "error", message: "Falha ao carregar serviços do sitter." });
      }
    }
    loadServices();
  }, [form.sitterId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      const payload = {
        petId: Number(form.petId),
        sitterId: Number(form.sitterId),
        sitterServicoPrecoId: Number(form.sitterServicoPrecoId),
        startDate: form.startDate, // "YYYY-MM-DDTHH:mm"
      };
      await createOwnerAppointment(payload);
      setFeedback({ type: "success", message: "Agendamento criado com sucesso!" });
      setForm({ petId: "", sitterId: "", sitterServicoPrecoId: "", startDate: "" });
      setServices([]);
    } catch (e) {
      console.error(e);
      setFeedback({ type: "error", message: "Não foi possível criar o agendamento." });
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
            <h1 className="text-4xl font-bold text-gray-800">Novo Agendamento</h1>
          </div>
        </header>

        <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet</label>
            <select
              name="petId"
              value={form.petId}
              onChange={onChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {(p.nome || p.name) ?? "Pet"} {p.especie ? `(${p.especie})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sitter</label>
            <select
              name="sitterId"
              value={form.sitterId}
              onChange={onChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione</option>
              {sitters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Serviço do Sitter</label>
            <select
              name="sitterServicoPrecoId"
              value={form.sitterServicoPrecoId}
              onChange={onChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!form.sitterId}
            >
              <option value="">Selecione</option>
              {services.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.servico} — R$ {Number(srv.valor).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Data/Hora</label>
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={onChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Criar Agendamento
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
