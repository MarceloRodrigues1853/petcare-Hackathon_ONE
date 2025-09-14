import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

// 1. Importando as funções de API reais para o Sitter
import { listSitters, updateSitter, deleteSitter } from '../../../api/sitter.api.js';

export default function Approvals() {
  const [pendingSitters, setPendingSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPendingSitters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 2. Buscando a lista COMPLETA de sitters
      const allSitters = await listSitters();
      
      // 3. Filtrando no front-end para encontrar apenas os pendentes
      //    (ASSUMINDO que o objeto Sitter tem um campo 'status')
      const pending = allSitters.filter(s => s.status?.toUpperCase() === 'PENDING');
      setPendingSitters(pending);

    } catch (err) {
      console.error("Falha ao buscar sitters pendentes:", err);
      setError("Não foi possível carregar a lista de aprovações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingSitters();
  }, [fetchPendingSitters]);
  
  const handleApprove = async (sitterId) => {
    try {
      const sitterToApprove = pendingSitters.find(s => s.id === sitterId);
      if (!sitterToApprove) return;

      // 4. Lógica de Aprovação:
      //    ASSUMINDO que podemos mudar o status via PUT
      const payload = { ...sitterToApprove, status: 'APPROVED' };
      await updateSitter(sitterId, payload);
      
      // Remove da lista local após o sucesso
      setPendingSitters(prev => prev.filter(s => s.id !== sitterId));
    } catch (err) {
      setError(`Erro ao aprovar o sitter ${sitterId}.`);
    }
  };
  
  const handleReject = async (sitterId) => {
    if (window.confirm('Tem a certeza que deseja rejeitar este registo? Esta ação não pode ser desfeita.')) {
      try {
        // 5. Lógica de Rejeição:
        //    ASSUMINDO que rejeitar significa deletar o registro
        await deleteSitter(sitterId);

        // Remove da lista local após o sucesso
        setPendingSitters(prev => prev.filter(s => s.id !== sitterId));
      } catch (err) {
        setError(`Erro ao rejeitar o sitter ${sitterId}.`);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar aprovações...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          {/* ... Seu header ... */}
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
                {pendingSitters.length > 0 ? pendingSitters.map(sitter => (
                  <tr key={sitter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sitter.name}</div>
                      <div className="text-sm text-gray-500">{sitter.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* 6. ASSUMINDO que a API retorna o campo 'registrationDate' */}
                      {sitter.registrationDate ? new Date(sitter.registrationDate).toLocaleDateString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center gap-4">
                        <button onClick={() => handleApprove(sitter.id)} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
                          <CheckCircle size={18} /> Aprovar
                        </button>
                        <button onClick={() => handleReject(sitter.id)} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors">
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