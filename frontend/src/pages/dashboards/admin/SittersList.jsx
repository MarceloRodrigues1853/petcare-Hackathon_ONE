import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MoreVertical, Edit, ArrowLeft, Users } from 'lucide-react';

// Importando as funções corretas da API
import { listSitters } from '../../../api/sitter.api.js';

export default function SittersList() {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchSitters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listSitters();
      setSitters(data);
    } catch (err) { // <<< AQUI ESTÁ A CORREÇÃO
      console.error("Falha ao buscar sitters:", err);
      setError("Não foi possível carregar a lista de cuidadores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSitters();
  }, [fetchSitters]);

  const filteredSitters = sitters.filter(sitter =>
    sitter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sitter.email && sitter.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Funções de aprovar/rejeitar/deletar foram removidas
  // pois a API do sitter-controller não suporta essas ações.

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar cuidadores...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Gerir Sitters</h1>
              <p className="text-gray-600 mt-2">Visualize os cuidadores registados na plataforma.</p>
            </div>
          </div>
        </header>

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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome / Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviços Oferecidos</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSitters.map(sitter => (
                  <tr key={sitter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sitter.name}</div>
                      <div className="text-sm text-gray-500">{sitter.email || 'Email não disponível'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sitter.servicos && sitter.servicos.length > 0
                        ? sitter.servicos.map(s => s.descricao).join(', ')
                        : 'Nenhum serviço configurado'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left group">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                          <MoreVertical size={20} />
                        </button>
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-10">
                          <div className="py-1">
                            <Link to={`/admin/sitter/${sitter.id}/edit`} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Edit size={16} /> Editar Perfil
                            </Link>
                             <Link to={`/admin/sitter/${sitter.id}/services`} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Users size={16} /> Gerir Serviços
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSitters.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhum cuidador encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}