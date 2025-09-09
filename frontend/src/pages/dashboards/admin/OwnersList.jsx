import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Trash2, ArrowLeft } from 'lucide-react';

// Dados de exemplo - substitua por uma chamada à API
const mockOwners = [
  { id: 1, name: 'Marcio Silveira', email: 'marcio@teste.com', pets: 2, registrationDate: '2025-08-15' },
  { id: 2, name: 'Jose Abreu', email: 'jose.a@teste.com', pets: 1, registrationDate: '2025-08-21' },
  { id: 3, name: 'Tatiana Oliveira', email: 'tati.oli@teste.com', pets: 3, registrationDate: '2025-09-01' },
  { id: 4, name: 'Beatriz Costa', email: 'bia.costa@teste.com', pets: 1, registrationDate: '2025-09-05' },
];

export default function OwnersList() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Chamar API real para buscar owners
    setLoading(true);
    setTimeout(() => {
      setOwners(mockOwners);
      setLoading(false);
    }, 500);
  }, []);
  
  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (ownerId) => {
    if (window.confirm('Tem a certeza que deseja remover este dono e todos os seus pets permanentemente?')) {
      console.log(`Remover dono ${ownerId}`);
      // TODO: Chamar API para remover
      setOwners(prev => prev.filter(o => o.id !== ownerId));
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
              <h1 className="text-4xl font-bold text-gray-800">Gerir Donos</h1>
              <p className="text-gray-600 mt-2">Visualize e gira os donos de pets registados na plataforma.</p>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº de Pets</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Registo</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-12 text-gray-500">A carregar...</td></tr>
                ) : filteredOwners.map(owner => (
                  <tr key={owner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                      <div className="text-sm text-gray-500">{owner.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{owner.pets}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(owner.registrationDate).toLocaleDateString('pt-BR')}
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
          </div>
        </div>
      </div>
    </div>
  );
}

