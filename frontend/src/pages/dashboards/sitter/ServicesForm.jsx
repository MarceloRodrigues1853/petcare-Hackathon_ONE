import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Dog, PawPrint, Home, ArrowLeft, CheckCircle, Eye, Search } from "lucide-react";

// 1. O caminho para o AuthContext foi corrigido
import { useAuth } from "../../../context/AuthContext";
import { listAllServices } from "../../../api/service.api.js";
import { getSitterServices, addSitterService, deleteSitterService } from "../../../api/sitter.api.js";

// Componente Toggle (sem mudanças)
function Toggle({ active, onChange }) {
  return (
    <div 
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${active ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${active ? 'translate-x-6' : ''}`}></div>
    </div>
  );
}

// Componente ServiceCard (sem mudanças)
function ServiceCard({ icon, service, onUpdate }) {
    // ...código do ServiceCard...
}

// Mapa de ícones (sem mudanças)
const iconMap = {
    // ...código do iconMap...
};

export default function ServicesForm() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [initialServices, setInitialServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const [availability, setAvailability] = useState('accepting');
  const availabilityOptions = [
    { key: 'accepting', icon: <CheckCircle size={20}/>, label: 'Aceitando serviços' },
    { key: 'viewing', icon: <Eye size={20}/>, label: 'Apenas visível' },
    { key: 'searching', icon: <Search size={20}/>, label: 'Buscando serviço' },
  ];

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [baseServices, sitterServices] = await Promise.all([
        listAllServices(),
        getSitterServices(user.id),
      ]);

      const sitterServiceMap = new Map(sitterServices.map(s => [s.servico.id, s]));

      const mergedServices = baseServices.map(baseService => {
        const sitterService = sitterServiceMap.get(baseService.id);
        return {
          id: baseService.id,
          descricao: baseService.descricao,
          active: !!sitterService,
          valor: sitterService ? sitterService.valor : 0,
          servicoPrecoId: sitterService ? sitterService.id : null,
        };
      });

      setServices(mergedServices);
      setInitialServices(JSON.parse(JSON.stringify(mergedServices)));
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erro ao carregar seus serviços.' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleServiceUpdate = (updatedService) => {
    setServices(currentServices =>
      currentServices.map(s => s.id === updatedService.id ? updatedService : s)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setFeedback(null);
    try {
      const promises = services.map(async (currentService) => {
        const initialService = initialServices.find(s => s.id === currentService.id);
        
        if (currentService.active && !initialService.active) {
          return addSitterService(user.id, { servicoId: currentService.id, valor: currentService.valor });
        }
        if (!currentService.active && initialService.active) {
          return deleteSitterService(user.id, initialService.servicoPrecoId);
        }
        if (currentService.active && initialService.active && currentService.valor !== initialService.valor) {
          await deleteSitterService(user.id, initialService.servicoPrecoId);
          return addSitterService(user.id, { servicoId: currentService.id, valor: currentService.valor });
        }
        return Promise.resolve();
      });
      
      await Promise.all(promises);
      setFeedback({ type: 'success', message: 'Serviços atualizados com sucesso!' });
      fetchData();
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erro ao salvar as alterações.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p className="text-center p-8">Carregando seus serviços...</p>;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header> {/* ...Seu Header... */} </header>

        <section className="mb-8 bg-white p-6 rounded-xl shadow-md">
          {/* ...Sua seção de Status de Serviço... */}
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 4. Renderização dinâmica dos serviços */}
          {services.map(service => (
            <ServiceCard 
              key={service.id}
              icon={iconMap[service.descricao] || <Dog size={24}/>}
              service={service}
              onUpdate={handleServiceUpdate}
            />
          ))}
          
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSaving ? 'Salvando...' : 'Guardar Alterações'}
            </button>
          </div>
        </form>
        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
          }>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
}