import { useState } from "react";
import { Link } from "react-router-dom";
import { Dog, PawPrint, Home, ArrowLeft, CheckCircle, Eye, Search } from "lucide-react";

// Dados de exemplo para a simulação
const initialServicesData = {
  walking: { active: true, price: 25.00 },
  sitting: { active: true, price: 80.00 },
  hosting: { active: false, price: 150.00 },
};

// Componente Toggle (com cores atualizadas)
function Toggle({ active, onChange }) {
    return (
        <div 
            role="switch"
            aria-checked={active}
            onClick={() => onChange(!active)}
            // A cor verde é aplicada aqui quando 'active' é true
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${active ? 'bg-green-500' : 'bg-gray-300'}`}
        >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${active ? 'translate-x-6' : ''}`}></div>
        </div>
    );
}

// Componente para cada cartão de serviço
function ServiceCard({ icon, title, serviceKey, services, setServices }) {
  const service = services[serviceKey];
  const handleToggle = (newActiveState) => setServices(prev => ({ ...prev, [serviceKey]: { ...prev[serviceKey], active: newActiveState }}));
  const handlePriceChange = (e) => setServices(prev => ({ ...prev, [serviceKey]: { ...prev[serviceKey], price: parseFloat(e.target.value) || 0 }}));

  return (
    <div className={`p-6 bg-white rounded-xl shadow-md transition-opacity ${!service?.active && 'opacity-50'}`}>
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
              type="number" value={service?.price || 0} onChange={handlePriceChange} disabled={!service?.active}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              placeholder="0.00" min="0" step="0.01" />
        </div>
      </div>
    </div>
  );
}


export default function ServicesForm() {
  const [services, setServices] = useState(initialServicesData);
  const [availability, setAvailability] = useState('accepting');

  const availabilityOptions = [
    { key: 'accepting', icon: <CheckCircle size={20}/>, label: 'Aceitando serviços' },
    { key: 'viewing', icon: <Eye size={20}/>, label: 'Apenas visível' },
    { key: 'searching', icon: <Search size={20}/>, label: 'Buscando serviço' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/sitter/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meus Serviços</h1>
            <p className="text-gray-600 mt-2">Gira a sua disponibilidade e os serviços que você oferece.</p>
          </div>
        </header>

        <section className="mb-8 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Status de Serviço</h2>
            {/* O estilo dos botões é definido aqui */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {availabilityOptions.map(opt => (
                    <button
                        key={opt.key}
                        type="button"
                        onClick={() => setAvailability(opt.key)}
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg font-semibold transition-colors border-2 ${
                            availability === opt.key 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
                        }`}
                    >
                        {opt.icon}
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>
        </section>

        <form className="space-y-6">
            <ServiceCard icon={<Dog size={24}/>} title="Passeio" serviceKey="walking" services={services} setServices={setServices} />
            <ServiceCard icon={<PawPrint size={24}/>} title="Babá de Pet" serviceKey="sitting" services={services} setServices={setServices} />
            <ServiceCard icon={<Home size={24}/>} title="Hospedagem" serviceKey="hosting" services={services} setServices={setServices} />
            
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                    Guardar Alterações
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

