import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

// Dados de exemplo - substitua por uma chamada à API
const mockPendingSitters = [
  { id: 3, name: 'Carlos Moura', email: 'carlos.m@teste.com', registrationDate: '2025-09-07' },
  { id: 6, name: 'Patrícia Poeta', email: 'p.poeta@teste.com', registrationDate: '2025-09-08' },
];

export default function Approvals() {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Chamar API real para buscar sitters pendentes
    setLoading(true);
    setTimeout(() => {
      setSitters(mockPendingSitters);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleApprove = (sitterId) => {
    console.log(`Aprovar sitter ${sitterId}`);
    // TODO: Chamar API para aprovar
    setSitters(prev => prev.filter(s => s.id !== sitterId));
  };
  
  const handleReject = (sitterId) => {
    if (window.confirm('Tem a certeza que deseja rejeitar este registo?')) {
        console.log(`Rejeitar sitter ${sitterId}`);
        // TODO: Chamar API para rejeitar
        setSitters(prev => prev.filter(s => s.id !== sitterId));
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
              <h1 className="text-4xl font-bold text-gray-800">Aprovações Pendentes</h1>
              <p className="text-gray-600 mt-2">Analise e aprove ou rejeite os novos sitters que se registaram.</p>
            </div>
          </div>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Registo</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="3" className="text-center py-12 text-gray-500">A carregar...</td></tr>
                ) : sitters.length > 0 ? sitters.map(sitter => (
                  <tr key={sitter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sitter.name}</div>
                      <div className="text-sm text-gray-500">{sitter.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sitter.registrationDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={() => handleApprove(sitter.id)} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200">
                               <CheckCircle size={18} /> Aprovar
                            </button>
                             <button onClick={() => handleReject(sitter.id)} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200">
                               <XCircle size={18} /> Rejeitar
                            </button>
                        </div>
                    </td>
                  </tr>
                )) : (
                    <tr><td colSpan="3" className="text-center py-12 text-gray-500">Não há aprovações pendentes.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

