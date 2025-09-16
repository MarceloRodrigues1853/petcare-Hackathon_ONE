import { useState, useEffect } from 'react';
import { listSitters } from '@/api/sitter.api.js';
import { PawPrint, MapPin } from 'lucide-react';

// Componente para exibir um único card de sitter
function SitterCard({ sitter }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
      <img
        src={`https://ui-avatars.com/api/?name=${sitter.name.replace(' ', '+')}&background=random&size=96`}
        alt={`Foto de ${sitter.name}`}
        className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-sm"
      />
      <h3 className="text-xl font-bold text-gray-800">{sitter.name}</h3>
      <p className="text-gray-500 mb-4">{sitter.email}</p>
      <div className="flex items-center text-gray-600 mb-2">
        <MapPin size={16} className="mr-2" />
        <span>Localização a ser adicionada</span>
      </div>
      <div className="flex items-center text-green-600">
        <PawPrint size={16} className="mr-2" />
        <span>Aceita Cães e Gatos</span>
      </div>
    </div>
  );
}

// Componente principal da página
export default function SitterSearch() {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSitters() {
      try {
        setLoading(true);
        // Usamos a função da API para buscar a lista de sitters
        const data = await listSitters();
        // Filtramos para mostrar apenas sitters com status 'APPROVED' (se existir no backend)
        // Se o backend já fizer isso, pode remover o .filter()
        setSitters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar sitters:", err);
        setError("Não foi possível carregar a lista de cuidadores.");
      } finally {
        setLoading(false);
      }
    }
    fetchSitters();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800">Encontre o Cuidador Perfeito</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore nossa rede de cuidadores de confiança. Todos são verificados para garantir a segurança e o bem-estar do seu pet.
          </p>
        </header>

        {loading && <p className="text-center text-gray-500">Carregando cuidadores...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sitters.length > 0 ? (
              sitters.map((sitter) => <SitterCard key={sitter.id} sitter={sitter} />)
            ) : (
              <p className="col-span-full text-center text-gray-500">Nenhum cuidador encontrado no momento.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
