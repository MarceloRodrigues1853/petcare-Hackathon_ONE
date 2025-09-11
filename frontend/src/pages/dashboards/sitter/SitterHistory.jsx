import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, History, Dog, DollarSign } from "lucide-react";

// API simulada - No futuro, você criaria uma função getHistory() no seu ficheiro api/sitter.js
async function getSitterHistory() {
  console.log("API MOCK: A buscar histórico de serviços...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 3, client: 'Mariana Lima', pet: 'Mimi', service: 'Babá de Pet', date: '2025-09-05', amount: 80.00 },
    { id: 4, client: 'Pedro Costa', pet: 'Thor', service: 'Passeio', date: '2025-09-04', amount: 25.00 },
    { id: 5, client: 'Juliana Alves', pet: 'Luna', service: 'Hospedagem', date: '2025-08-28', amount: 450.00 },
  ];
}


export default function SitterHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const data = await getSitterHistory();
        setHistory(data);
      } catch (error) {
        console.error("Falha ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar o seu histórico...</div>;
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
                <div key={item.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <div className="bg-gray-100 text-gray-600 p-3 rounded-full">
                      <History size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{item.client} - <span className="text-gray-600 font-medium">{item.pet}</span></p>
                      <p className="text-sm text-gray-500">{item.service} em {new Date(item.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                      <div className="flex items-center space-x-2 text-green-600 font-semibold">
                          <DollarSign size={18} />
                          <span>{brl.format(item.amount)}</span>
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

