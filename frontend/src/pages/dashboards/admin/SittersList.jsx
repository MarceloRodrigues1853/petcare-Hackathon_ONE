import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Trash2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

// Dados de exemplo - substitua por uma chamada à API
const mockSitters = [
  { id: 1, name: 'Ricardo Dorneles', email: 'ricardo@teste.com', rating: 4.9, status: 'APROVADO' },
  { id: 2, name: 'Ana Beatriz', email: 'ana.b@teste.com', rating: 4.7, status: 'APROVADO' },
  { id: 3, name: 'Carlos Moura', email: 'carlos.m@teste.com', rating: 0, status: 'PENDENTE' },
  { id: 4, name: 'Fernanda Lima', email: 'f.lima@teste.com', rating: 4.8, status: 'APROVADO' },
  { id: 5, name: 'Juliana Paes', email: 'j.paes@teste.com', rating: 0, status: 'REJEITADO' },
];

export default function SittersList() {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Chamar API real para buscar sitters
    setLoading(true);
    setTimeout(() => {
      setSitters(mockSitters);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSitters = sitters.filter(sitter =>
    sitter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sitter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (sitterId) => {
    console.log(`Aprovar sitter ${sitterId}`);
    // TODO: Chamar API para aprovar
    setSitters(prev => prev.map(s => s.id === sitterId ? { ...s, status: 'APROVADO' } : s));
  };

  const handleReject = (sitterId) => {
    console.log(`Rejeitar sitter ${sitterId}`);
    // TODO: Chamar API para rejeitar
    setSitters(prev => prev.map(s => s.id === sitterId ? { ...s, status: 'REJEITADO' } : s));
  };

  const handleDelete = (sitterId) => {
    if (window.confirm('Tem a certeza que deseja remover este sitter permanentemente?')) {
      console.log(`Remover sitter ${sitterId}`);
      // TODO: Chamar API para remover
      setSitters(prev => prev.filter(s => s.id !== sitterId));
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'APROVADO': return 'bg-green-100 text-green-800';
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
      case 'REJEITADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-4xl font-bold text-gray-800">Gerir Sitters</h1>
              <p className="text-gray-600 mt-2">Aprove, rejeite ou remova sitters da plataforma.</p>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avaliação</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-12 text-gray-500">A carregar...</td></tr>
                ) : filteredSitters.map(sitter => (
                  <tr key={sitter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sitter.name}</div>
                      <div className="text-sm text-gray-500">{sitter.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sitter.rating > 0 ? `${sitter.rating.toFixed(1)} / 5.0` : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(sitter.status)}`}>
                        {sitter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left group">
                          <button className="p-2 rounded-full hover:bg-gray-100">
                              <MoreVertical size={20} />
                          </button>
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-10">
                              <div className="py-1">
                                  {sitter.status === 'PENDENTE' && (
                                      <>
                                          <button onClick={() => handleApprove(sitter.id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                              <CheckCircle size={16} className="text-green-500" /> Aprovar
                                          </button>
                                          <button onClick={() => handleReject(sitter.id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                              <XCircle size={16} className="text-orange-500" /> Rejeitar
                                          </button>
                                      </>
                                  )}
                                  <button onClick={() => handleDelete(sitter.id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
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
    </div>
  );
}

