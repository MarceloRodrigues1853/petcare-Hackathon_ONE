import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, History, DollarSign } from "lucide-react";

// 1. Importando a função de API real para buscar agendamentos
import { listAppointments } from "../../../api/appointment.api.js";

export default function SitterHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 2. Buscando TODOS os agendamentos do sitter logado
      const allAppointments = await listAppointments();
      
      // 3. Filtrando no front-end para criar a lista de "histórico"
      //    (apenas agendamentos com status "CONCLUIDO")
      const completedAppointments = allAppointments.filter(
        apt => apt.status?.toUpperCase() === 'CONCLUIDO'
      );
      
      setHistory(completedAppointments);
    } catch (err) {
      console.error("Falha ao buscar histórico:", err);
      setError("Não foi possível carregar seu histórico de serviços.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar o seu histórico...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/sitter/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meu Histórico</h1>
            <p className="text-gray-600 mt-2">Veja um resumo de todos os serviços que você já concluiu.</p>
          </div>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map(item => (
                <div key={item.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 text-gray-600 p-3 rounded-full">
                      <History size={24} />
                    </div>
                    <div>
                      {/* 4. Corrigindo o acesso aos dados para bater com a API real */}
                      <p className="font-bold text-gray-800">
                        {item.owner?.name || 'Cliente'} - <span className="text-gray-600 font-medium">{item.pet?.nome || 'Pet'}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.sitterServicoPreco?.servico?.descricao || 'Serviço'} em {new Date(item.dataInicio).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                      <div className="flex items-center space-x-2 text-green-600 font-semibold">
                        <DollarSign size={18} />
                        <span>{brl.format(item.sitterServicoPreco?.valor || 0)}</span>
                      </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhum serviço concluído encontrado no seu histórico.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}