import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createAppointment } from "../../../api/owner";

// Lista de serviços com preço
const services = [
  { label: "Babá de Pets", price: 50 },
  { label: "Passeio", price: 55 },
  { label: "Hospedagem", price: 60 },
];

export default function AppointmentNew() {
  const [appointment, setAppointment] = useState({
    pet: "",
    date: "",
    service: "",
    price: 0,
  });
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "service") {
      const selectedService = services.find((s) => s.label === value);
      setAppointment((prev) => ({ ...prev, service: value, price: selectedService.price }));
    } else {
      setAppointment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createAppointment(appointment);
      setFeedback({ type: "success", message: res.message });
      setAppointment({ pet: "", date: "", service: "", price: 0 });
    } catch (error) {
      setFeedback({ type: "error", message: "Erro ao criar agendamento." });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Botão voltar */}
        <header className="mb-8 relative flex items-center">
          <Link to="/owner/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Novo Agendamento</h1>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pet
            </label>
            <input
              name="pet"
              value={appointment.pet}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Serviço
            </label>
            <select
              name="service"
              value={appointment.service}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione um serviço</option>
              {services.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label} - R$ {s.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Buscar Agendamento
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
