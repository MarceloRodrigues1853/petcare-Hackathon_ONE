// src/pages/dashboards/sitter/SitterHistory.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, History, DollarSign } from "lucide-react";
import { getAppointments } from "../../../api/sitter.js";

export default function SitterHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // GET /api/sitters/me/appointments?status=CONCLUIDO
        const data = await getAppointments({ status: 'CONCLUIDO' });
        setHistory(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando histórico...</div>;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center">
          <Link to="/sitter/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meu Histórico</h1>
            <p className="text-gray-600 mt-2">Serviços concluídos.</p>
          </div>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="space-y-4">
            {history.length ? history.map(item => (
              <div key={item.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className="bg-gray-100 text-gray-600 p-3 rounded-full"><History size={24} /></div>
                  <div>
                    <p className="font-bold text-gray-800">{item.clientName} - <span className="text-gray-600 font-medium">{item.petName}</span></p>
                    <p className="text-sm text-gray-500">{item.serviceName} em {new Date(item.endAt || item.startAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <div className="flex items-center space-x-2 text-green-600 font-semibold">
                    <DollarSign size={18} />
                    <span>{brl.format(item.amount || 0)}</span>
                  </div>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 py-8">Nenhum serviço concluído.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
