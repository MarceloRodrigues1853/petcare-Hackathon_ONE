import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, Trash2, Eye, ChevronLeft } from "lucide-react";

// Mock da API para simular a busca de dados.
// Substitua isso pelas suas chamadas de API reais.
const mockOwners = [
    { id: 1, name: "Ana Silva", email: "ana.silva@email.com", joinDate: "2024-08-15", totalPets: 2, status: "Active" },
    { id: 2, name: "Bruno Costa", email: "bruno.c@email.com", joinDate: "2024-07-22", totalPets: 1, status: "Active" },
    { id: 3, name: "Carla Martins", email: "carla.m@email.com", joinDate: "2024-06-05", totalPets: 3, status: "Suspended" },
    { id: 4, name: "Daniel Rocha", email: "dani.rocha@email.com", joinDate: "2024-09-01", totalPets: 1, status: "Active" },
];

async function getOwners(searchTerm = "") {
    console.log(`Buscando donos com o termo: "${searchTerm}"`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula atraso de rede
    if (!searchTerm) {
        return mockOwners;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return mockOwners.filter(owner =>
        owner.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        owner.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
}


// Componente principal da Lista de Donos
export default function OwnersList() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOwners = async (term) => {
        try {
            setLoading(true);
            const ownersData = await getOwners(term);
            setOwners(ownersData);
        } catch (error) {
            console.error("Falha ao carregar lista de donos:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOwners("");
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOwners(searchTerm);
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <Link to="/admin/dashboard" className="flex items-center text-gray-500 hover:text-gray-800 mb-4">
                        <ChevronLeft size={20} className="mr-2" />
                        Voltar para o Painel
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800">Gerenciamento de Donos</h1>
                    <p className="text-gray-600 mt-2">Visualize, pesquise e administre os donos de pets cadastrados na plataforma.</p>
                </header>

                <main className="bg-white p-6 rounded-xl shadow-md">
                    {/* Barra de Busca e Filtros */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex items-center space-x-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Pesquisar por nome ou e-mail..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Pesquisar
                            </button>
                        </form>
                    </div>

                    {/* Tabela de Donos */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">A carregar donos...</div>
                        ) : owners.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Cadastro</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Ações</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {owners.map((owner) => (
                                        <tr key={owner.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{owner.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{new Date(owner.joinDate).toLocaleDateString('pt-BR')}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${owner.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {owner.status === 'Active' ? 'Ativo' : 'Suspenso'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900" title="Ver Perfil">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900" title="Suspender Usuário">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                             <div className="text-center py-8 text-gray-500">Nenhum dono encontrado.</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
