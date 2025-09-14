import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Edit, Trash2, ArrowLeft } from 'lucide-react';

// 1. Importando TODAS as funções de API necessárias para este CRUD
import { listAllServices, createService, updateService, deleteService } from '../../../api/service.api.js';

// Modal para Criar/Editar Serviço
const ServiceFormModal = ({ service, onClose, onSave }) => {
    // A API usa 'descricao', então ajustamos o estado para ser consistente
    const [descricao, setDescricao] = useState(service?.descricao || '');
    // A API não tem um 'valor base', apenas descrição. Vamos remover este campo por enquanto.
    // const [baseValue, setBaseValue] = useState(service?.baseValue || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        // 2. Montando o payload CORRETO que a API espera
        const payload = { 
            id: service?.id,
            descricao: descricao,
        };
        onSave(payload);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">{service ? 'Editar' : 'Criar'} Tipo de Serviço</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <input
                                type="text"
                                id="description"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        {/* O campo 'baseValue' foi removido pois não existe na API de /api/servicos */}
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function ServiceTypes() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 3. Buscando os dados reais da API
      const data = await listAllServices();
      setServices(data);
    } catch (err) {
      console.error("Falha ao buscar tipos de serviço:", err);
      setError("Não foi possível carregar os tipos de serviço.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  const handleSaveService = async (serviceData) => {
      try {
        if (serviceData.id) {
            // 4. Lógica de ATUALIZAÇÃO real
            const updated = await updateService(serviceData.id, { descricao: serviceData.descricao });
            setServices(prev => prev.map(s => s.id === serviceData.id ? updated : s));
        } else {
            // 5. Lógica de CRIAÇÃO real
            const created = await createService({ descricao: serviceData.descricao });
            setServices(prev => [...prev, created]);
        }
        setIsModalOpen(false);
        setEditingService(null);
      } catch (err) {
        // TODO: Exibir erro de salvamento na UI
        console.error("Erro ao salvar serviço:", err);
      }
  };
  
  const handleDelete = async (serviceId) => {
      if (window.confirm('Tem a certeza que deseja remover este tipo de serviço?')) {
        try {
            // 6. Lógica de DELEÇÃO real
            await deleteService(serviceId);
            setServices(prev => prev.filter(s => s.id !== serviceId));
        } catch(err) {
            console.error("Erro ao deletar serviço:", err);
        }
      }
  };
  
  // A API de /api/servicos não parece ter um status 'active', então esta função não é mais necessária.
  // const handleToggleActive = (serviceId) => { /* ... */ };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header> {/* ... Seu header ... */} </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-end items-center mb-6">
            <button onClick={() => { setEditingService(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={20} /> Novo Serviço
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  {/* A API não retorna 'valor base' nem 'status', então essas colunas foram removidas. */}
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map(service => (
                  <tr key={service.id}>
                    {/* 7. O nome do campo é 'descricao' e não 'description' */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.descricao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left group">
                          <button className="p-2 rounded-full hover:bg-gray-100">
                              <MoreVertical size={20} />
                          </button>
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-10">
                              <div className="py-1">
                                  <button onClick={() => { setEditingService(service); setIsModalOpen(true); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                      <Edit size={16} /> Editar
                                  </button>
                                  <button onClick={() => handleDelete(service.id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                      <Trash2 size={16} /> Remover
                                  </button>
                              </div>
                          </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {services.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    <p>Nenhum tipo de serviço encontrado. Clique em "Novo Serviço" para começar.</p>
                </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && <ServiceFormModal service={editingService} onClose={() => setIsModalOpen(false)} onSave={handleSaveService} />}
    </div>
  );
}