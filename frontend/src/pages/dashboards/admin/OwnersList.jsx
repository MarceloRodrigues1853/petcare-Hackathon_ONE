import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Trash2, ArrowLeft } from 'lucide-react';

// 1. Importando as funções de API reais do nosso arquivo owner.api.js
import { listOwners, deleteOwner } from '../../../api/owner.api.js';

export default function OwnersList() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchOwners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 2. Usando a função de API real para buscar a lista de donos
      const data = await listOwners();
      setOwners(data);
    } catch (err) {
      console.error("Falha ao buscar donos:", err);
      setError("Não foi possível carregar a lista de donos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);
  
  // A sua lógica de busca no client-side está ótima.
  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (ownerId) => {
    if (window.confirm('Tem a certeza que deseja remover este dono e todos os seus pets permanentemente?')) {
      try {
        // 3. Usando a função de API real para deletar o dono
        await deleteOwner(ownerId);
        setOwners(prev => prev.filter(o => o.id !== ownerId));
      } catch (err) {
        setError(`Erro ao remover o dono. Tente novamente.`);
      }
    }
  };
  
  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar lista de donos...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header> {/* ... Seu header ... */} </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Procurar por nome ou email..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nº de Pets</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Registo</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOwners.map(owner => (
                  <tr key={owner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                      <div className="text-sm text-gray-500">{owner.email}</div>
                    </td>
                    {/* 4. Tratando os dados que não vêm da API */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{owner.pets?.length || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {owner.registrationDate ? new Date(owner.registrationDate).toLocaleDateString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="relative inline-block text-left group">
                          <button className="p-2 rounded-full hover:bg-gray-100">
                            <MoreVertical size={20} />
                          </button>
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-10">
                              <div className="py-1">
                                  <button onClick={() => handleDelete(owner.id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                      <Trash2 size={16} /> Remover Dono
                                  </button>
                              </div>
                          </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOwners.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhum dono encontrado com os critérios de busca.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}