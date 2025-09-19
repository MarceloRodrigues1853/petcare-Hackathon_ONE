//
// CAMINHO: src/pages/Admin/ServiceTypes.jsx
//
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { getServiceTypes, createServiceType, updateServiceType, deleteServiceType } from '../../api/admin';

const ServiceFormModal = ({ service, onClose, onSave }) => {
    const [description, setDescription] = useState(service?.description || '');
    const [baseValue, setBaseValue] = useState(service?.baseValue || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...service, description, baseValue: parseFloat(baseValue) });
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
                                type="text" id="description" value={description} onChange={e => setDescription(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required
                            />
                        </div>
                        <div>
                            <label htmlFor="baseValue" className="block text-sm font-medium text-gray-700">Valor Base (R$)</label>
                            <input
                                type="number" id="baseValue" step="0.01" value={baseValue} onChange={e => setBaseValue(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required
                            />
                        </div>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServiceTypes();
      setServices(data);
    } catch (error) {
      console.error("Erro ao buscar tipos de serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);
  
  const handleSaveService = async (service) => {
    try {
      if (service.id) {
        await updateServiceType(service.id, service);
      } else {
        await createServiceType(service);
      }
      fetchServices(); // Recarrega a lista
    } catch (error) {
      alert("Falha ao salvar o serviço.");
    } finally {
      setIsModalOpen(false);
      setEditingService(null);
    }
  };
  
  const handleDelete = async (serviceId) => {
    if (window.confirm('Tem a certeza que deseja remover este tipo de serviço?')) {
      try {
        await deleteServiceType(serviceId);
        fetchServices();
      } catch (error) {
        alert("Falha ao remover o serviço.");
      }
    }
  };
  
  const handleToggleActive = async (service) => {
    try {
        const updatedService = { ...service, active: !service.active };
        await updateServiceType(service.id, updatedService);
        fetchServices();
    } catch (error) {
        alert("Falha ao alterar o status do serviço.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Tipos de Serviço</h1>
                    <p className="text-gray-600 mt-2">Gira os serviços que os sitters podem oferecer na plataforma.</p>
                </div>
            </div>
        </header>

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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Base</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-12 text-gray-500">A carregar...</td></tr>
                ) : services.map(service => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {Number(service.baseValue).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => handleToggleActive(service)} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                           {service.active ? 'Ativo' : 'Inativo'}
                        </button>
                    </td>
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
          </div>
        </div>
      </div>
      {isModalOpen && <ServiceFormModal service={editingService} onClose={() => setIsModalOpen(false)} onSave={handleSaveService} />}
    </div>
  );
}