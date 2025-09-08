import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Eye, ChevronLeft, ShieldCheck, Star } from "lucide-react";

// Mock da API para simular a busca de dados.
// Substitua isso pelas suas chamadas de API reais.
const mockSitters = [
    { id: 1, name: "Fernanda Lima", email: "fernanda.l@email.com", joinDate: "2024-08-10", rating: 4.8, status: "Approved" },
    { id: 2, name: "Gustavo Mendes", email: "gustavo.m@email.com", joinDate: "2024-07-15", rating: 4.5, status: "Approved" },
    { id: 3, name: "Helena Souza", email: "helena.s@email.com", joinDate: "2024-09-02", rating: 0, status: "Pending" },
    { id: 4, name: "Igor Almeida", email: "igor.a@email.com", joinDate: "2024-05-20", rating: 3.2, status: "Suspended" },
];

async function getSitters(searchTerm = "") {
    console.log(`Buscando sitters com o termo: "${searchTerm}"`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula atraso de rede
    if (!searchTerm) {
        return mockSitters;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return mockSitters.filter(sitter =>
        sitter.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        sitter.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
}


// Componente principal da Lista de Sitters
export default function SittersList() {
    const [sitters, setSitters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSitters = async (term) => {
        try {
            setLoading(true);
            const sittersData = await getSitters(term);
            setSitters(sittersData);
        } catch (error) {
            console.error("Falha ao carregar lista de sitters:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSitters("");
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSitters(searchTerm);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Approved':
                return { text: 'Aprovado', className: 'bg-green-100 text-green-800' };
            case 'Pending':
                return { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800' };
            case 'Suspended':
                return { text: 'Suspenso', className: 'bg-red-100 text-red-800' };
            default:
                return { text: 'Desconhecido', className: 'bg-gray-100 text-gray-800' };
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <Link to="/admin/dashboard" className="flex items-center text-gray-500 hover:text-gray-800 mb-4">
                        <ChevronLeft size={20} className="mr-2" />
                        Voltar para o Painel
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800">Gerenciamento de Sitters</h1>
                    <p className="text-gray-600 mt-2">Visualize, pesquise e administre os sitters cadastrados na plataforma.</p>
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

                    {/* Tabela de Sitters */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">A carregar sitters...</div>
                        ) : sitters.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avaliação</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Cadastro</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Ações</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sitters.map((sitter) => {
                                        const statusInfo = getStatusInfo(sitter.status);
                                        return (
                                            <tr key={sitter.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{sitter.name}</div>
                                                    <div className="text-sm text-gray-500">{sitter.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Star size={16} className="text-yellow-500 mr-1" />
                                                        <span className="text-sm text-gray-800">{sitter.rating.toFixed(1)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{new Date(sitter.joinDate).toLocaleDateString('pt-BR')}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                                                        {statusInfo.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                     {sitter.status === 'Pending' && (
                                                         <button className="text-green-600 hover:text-green-900" title="Aprovar Cadastro">
                                                            <ShieldCheck size={18} />
                                                        </button>
                                                     )}
                                                    <button className="text-blue-600 hover:text-blue-900" title="Ver Perfil">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900" title="Suspender Sitter">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                             <div className="text-center py-8 text-gray-500">Nenhum sitter encontrado.</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
