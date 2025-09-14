import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Dog, PawPrint, Home, ArrowLeft, CheckCircle, Eye, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// 1. Importando TODAS as funções de API necessárias
import { listAllServices } from "../../api/service.api.js";
import { getSitterServices, addSitterService, deleteSitterService } from "../../api/sitter.api.js";

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

// Componente ServiceCard (ligeiramente ajustado para ser mais reutilizável)
function ServiceCard({ icon, service, onUpdate }) {
  const handleToggle = (newActiveState) => {
    onUpdate({ ...service, active: newActiveState });
  };
  const handlePriceChange = (e) => {
    onUpdate({ ...service, valor: parseFloat(e.target.value) || 0 });
  };

  return (
    <div className={`p-6 bg-white rounded-xl shadow-md transition-opacity ${!service.active && 'opacity-50'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
          <h3 className="text-xl font-bold text-gray-800">{service.descricao}</h3>
        </div>
        <Toggle active={service.active} onChange={handleToggle} />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">Preço por serviço (R$)</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R$</span>
          <input 
            type="number"
            value={service.valor}
            onChange={handlePriceChange}
            disabled={!service.active}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            placeholder="0.00" min="0" step="0.01"
          />
        </div>
      </div>
    </div>
  );
}

// Mapa de ícones para renderização dinâmica
const iconMap = {
  'Passeio': <Dog size={24}/>,
  'Babá de Pet': <PawPrint size={24}/>,
  'Hospedagem': <Home size={24}/>,
};

export default function ServicesForm() {
  const { user } = useAuth();
  // 2. Estado agora é um array, para ser dinâmico
  const [services, setServices] = useState([]);
  const [initialServices, setInitialServices] = useState([]); // Para comparar o que mudou
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  // Status de disponibilidade (sem API correspondente, por enquanto é apenas UI)
  const [availability, setAvailability] = useState('accepting');
  const availabilityOptions = [
    { key: 'accepting', icon: <CheckCircle size={20}/>, label: 'Aceitando serviços' },
    { key: 'viewing', icon: <Eye size={20}/>, label: 'Apenas visível' },
    { key: 'searching', icon: <Search size={20}/>, label: 'Buscando serviço' },
  ];

  // 3. Efeito que busca e combina os dados da API
  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [baseServices, sitterServices] = await Promise.all([
        listAllServices(),
        getSitterServices(user.id),
      ]);

      // Mapeia os serviços que o Sitter já oferece para fácil acesso
      const sitterServiceMap = new Map(sitterServices.map(s => [s.servico.id, s]));

      // Combina as duas listas
      const mergedServices = baseServices.map(baseService => {
        const sitterService = sitterServiceMap.get(baseService.id);
        return {
          id: baseService.id, // ID do serviço base (ex: 1 para "Passeio")
          descricao: baseService.descricao,
          active: !!sitterService, // Está ativo se o sitter já oferece
          valor: sitterService ? sitterService.valor : 0, // Preço do sitter ou 0
          servicoPrecoId: sitterService ? sitterService.id : null, // ID da relação (importante para o DELETE)
        };
      });

      setServices(mergedServices);
      setInitialServices(JSON.parse(JSON.stringify(mergedServices))); // Cópia profunda para comparação
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erro ao carregar seus serviços.' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Função para atualizar um serviço específico na lista
  const handleServiceUpdate = (updatedService) => {
    setServices(currentServices =>
      currentServices.map(s => s.id === updatedService.id ? updatedService : s)
    );
  };

  // 5. Lógica para salvar as alterações
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setFeedback(null);
    try {
      const promises = services.map(async (currentService) => {
        const initialService = initialServices.find(s => s.id === currentService.id);
        
        // Caso 1: Serviço foi ATIVADO
        if (currentService.active && !initialService.active) {
          return addSitterService(user.id, { servicoId: currentService.id, valor: currentService.valor });
        }
        // Caso 2: Serviço foi DESATIVADO
        if (!currentService.active && initialService.active) {
          return deleteSitterService(user.id, initialService.servicoPrecoId);
        }
        // Caso 3: Preço foi ALTERADO (exige delete + add, pois não há PUT)
        if (currentService.active && initialService.active && currentService.valor !== initialService.valor) {
          await deleteSitterService(user.id, initialService.servicoPrecoId);
          return addSitterService(user.id, { servicoId: currentService.id, valor: currentService.valor });
        }
        return Promise.resolve(); // Nenhuma mudança
      });
      
      await Promise.all(promises);
      setFeedback({ type: 'success', message: 'Serviços atualizados com sucesso!' });
      fetchData(); // Re-busca os dados para sincronizar o estado
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