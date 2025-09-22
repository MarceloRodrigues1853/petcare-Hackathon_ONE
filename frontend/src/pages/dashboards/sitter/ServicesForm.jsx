// src/pages/dashboards/sitter/ServicesForm.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dog, PawPrint, Home, ArrowLeft } from "lucide-react";
import { getMyServices, saveMyServices } from "@/api/sitter.js";

function Toggle({ active, onChange }) {
  return (
    <div
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        active ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
          active ? "translate-x-6" : ""
        }`}
      />
    </div>
  );
}

function ServiceCard({ icon, title, serviceKey, services, setServices }) {
  const s = services?.[serviceKey] || { active: false, price: 0 };
  const handleToggle = (v) =>
    setServices((p) => ({ ...p, [serviceKey]: { ...s, active: v } }));
  const handlePriceChange = (e) =>
    setServices((p) => ({
      ...p,
      [serviceKey]: { ...s, price: Number.parseFloat(e.target.value) || 0 },
    }));

  return (
    <div
      className={`p-6 bg-white rounded-xl shadow-md transition-opacity ${
        !s.active && "opacity-50"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <Toggle active={s.active} onChange={handleToggle} />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Preço (R$)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            R$
          </span>
          <input
            type="number"
            value={s.price}
            onChange={handlePriceChange}
            disabled={!s.active}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}

export default function ServicesForm() {
  const [services, setServices] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ kind: "", msg: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyServices();
        setServices(data);
      } catch (e) {
        console.error(e);
        setServices({
          walking: { active: false, price: 0 },
          sitting: { active: false, price: 0 },
          hosting: { active: false, price: 0 },
        });
        setFeedback({ kind: "error", msg: e?.message || "Falha ao carregar serviços." });
      }
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveMyServices(services);
      setFeedback({ kind: "success", msg: "Serviços salvos!" });
    } catch (e) {
      setFeedback({
        kind: "error",
        msg: e?.message || "Falha ao salvar serviços.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback({ kind: "", msg: "" }), 3500);
    }
  }

  if (!services) return <div className="p-6">Carregando...</div>;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link
            to="/sitter/dashboard"
            className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full"
            title="Voltar"
          >
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meus Serviços</h1>
            <p className="text-gray-600 mt-2">Gerencie sua disponibilidade e preços.</p>
          </div>
        </header>

        <form className="space-y-6" onSubmit={onSubmit}>
          <ServiceCard
            icon={<Dog size={24} />}
            title="Passeio"
            serviceKey="walking"
            services={services}
            setServices={setServices}
          />
          <ServiceCard
            icon={<PawPrint size={24} />}
            title="Babá"
            serviceKey="sitting"
            services={services}
            setServices={setServices}
          />
          <ServiceCard
            icon={<Home size={24} />}
            title="Hospedagem"
            serviceKey="hosting"
            services={services}
            setServices={setServices}
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>

        {feedback.msg && (
          <div
            className={`mt-4 text-center font-semibold p-3 rounded ${
              feedback.kind === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {feedback.msg}
          </div>
        )}
      </div>
    </div>
  );
}
