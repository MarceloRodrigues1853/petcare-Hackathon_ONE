import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// 1. CORREÇÃO: Importando apenas as funções que existem em sitter.api.js
import { listSitters, updateSitter } from '@/api/sitter.api.js';

export default function Approvals() {
  const [pendingSitters, setPendingSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPendingSitters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allSitters = await listSitters();
      // Assumindo que o objeto Sitter tem um campo 'status'
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
  
  // Função unificada para alterar o status
  const handleStatusChange = async (sitterId, newStatus) => {
    try {
      const sitterToUpdate = pendingSitters.find(s => s.id === sitterId);
      if (!sitterToUpdate) return;

      // Usando a API de update para alterar o status
      const payload = { ...sitterToUpdate, status: newStatus };
      await updateSitter(sitterId, payload);
      
      // Remove da lista local após o sucesso da ação
      setPendingSitters(prev => prev.filter(s => s.id !== sitterId));
    } catch (err) {
      setError(`Erro ao tentar ${newStatus === 'APPROVED' ? 'aprovar' : 'rejeitar'} o cuidador.`);
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
                {pendingSitters.length > 0 ? pendingSitters.map(sitter => (
                  <tr key={sitter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sitter.name}</div>
                      <div className="text-sm text-gray-500">{sitter.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sitter.registrationDate ? new Date(sitter.registrationDate).toLocaleDateString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center gap-4">
                        {/* 2. CORREÇÃO: Ambas as ações agora chamam handleStatusChange */}
                        <button onClick={() => handleStatusChange(sitter.id, 'APPROVED')} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200">
                          <CheckCircle size={18} /> Aprovar
                        </button>
                        <button onClick={() => handleStatusChange(sitter.id, 'REJECTED')} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200">
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