import { useEffect, useState } from "react";
import { Dog, PawPrint, Home } from "lucide-react";
// CORREÇÃO: O caminho foi ajustado para subir três níveis (../../../)
import { getMyServices, saveMyServices } from "../../../api/sitter";

function Toggle({ active, onChange, label }) {
    const handleKey = (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!active);
        }
    }
    return (
        <div 
            role="switch"
            aria-checked={active}
            tabIndex={0}
            onClick={() => onChange(!active)}
            onKeyDown={handleKey}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${active ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : ''}`}></div>
        </div>
    );
}

function ServiceCard({ icon, title, serviceKey, services, setServices }) {
  const service = services[serviceKey];
  
  const handleToggle = (newActiveState) => {
    setServices(prev => ({
      ...prev,
      [serviceKey]: { ...prev[serviceKey], active: newActiveState }
    }));
  };

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value) || 0;
     setServices(prev => ({
      ...prev,
      [serviceKey]: { ...prev[serviceKey], price: newPrice }
    }));
  };

  return (
    <div className={`p-6 bg-white rounded-xl shadow-md transition-opacity duration-300 ${!service?.active && 'opacity-50'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <Toggle active={service?.active || false} onChange={handleToggle} />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">Preço por serviço (R$)</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R$</span>
            <input 
              type="number"
              value={service?.price || 0}
              onChange={handlePriceChange}
              disabled={!service?.active}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
        </div>
      </div>
    </div>
  );
}


export default function ServicesForm() {
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const data = await getMyServices();
        setServices(data);
      } catch (error) {
        console.error("Falha ao buscar serviços:", error);
        setFeedback({ message: 'Não foi possível carregar seus serviços.', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      setFeedback({ message: '', type: '' });
      try {
          const response = await saveMyServices(services);
          setFeedback({ message: response.message, type: 'success' });
      } catch (error) {
          setFeedback({ message: error.message || 'Falha ao salvar. Tente novamente.', type: 'error' });
      } finally {
          setSaving(false);
          setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
      }
  };

  if (loading) {
    return <div className="p-8 text-center">A carregar os seus serviços...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Meus Serviços</h1>
          <p className="text-gray-600 mt-2">Ative ou desative os serviços que você oferece e defina seus preços.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
            <ServiceCard icon={<Dog size={24}/>} title="Passeio" serviceKey="walking" services={services} setServices={setServices} />
            <ServiceCard icon={<PawPrint size={24}/>} title="Babá de Pet" serviceKey="sitting" services={services} setServices={setServices} />
            <ServiceCard icon={<Home size={24}/>} title="Hospedagem" serviceKey="hosting" services={services} setServices={setServices} />
            
            <div className="flex justify-end pt-4">
                <button 
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {saving ? 'A guardar...' : 'Guardar Alterações'}
                </button>
            </div>
        </form>

        {feedback.message && (
             <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.message}
             </div>
        )}
      </div>
    </div>
  );
}