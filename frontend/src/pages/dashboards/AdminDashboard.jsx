import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, DollarSign, ClipboardList, Briefcase, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Usado para garantir que o usuário é admin

// 1. Importando todas as funções de listagem necessárias da nossa API
import { listAllUsers } from "../../api/user.api.js";
import { listOwners } from "../../api/owner.api.js";
import { listSitters } from "../../api/sitter.api.js";
import { listAppointments } from "../../api/appointment.api.js";

// Componente reutilizável para os cards de estatísticas (sem mudanças)
function StatCard({ icon, title, value, colorClass = "blue" }) {
    const colors = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
            <div className={`p-3 rounded-full ${colors[colorClass]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

// Componente principal do Dashboard do Admin
export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    const fetchData = useCallback(async () => {
        // Garante que só busca dados se o usuário for um Admin
        if (user?.role !== 'ADMIN') {
            setLoading(false);
            setError("Acesso não autorizado.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            // 2. Usando Promise.all para buscar todos os dados em paralelo
            const [usersData, ownersData, sittersData, appointmentsData] = await Promise.all([
                listAllUsers(),
                listOwners(),
                listSitters(),
                listAppointments(),
            ]);

            // 3. Montando o objeto de estatísticas a partir dos dados recebidos
            const statsObject = {
                totalUsers: usersData.length,
                totalSitters: sittersData.length,
                totalOwners: ownersData.length,
                totalAppointments: appointmentsData.length,
                // TODO: A API precisa fornecer estes dados. Por enquanto, valores fixos.
                monthlyRevenue: 0, 
                pendingApprovals: 0,
            };
            setStats(statsObject);

        } catch (err) {
            console.error("Falha ao carregar dados do dashboard de admin:", err);
            setError("Não foi possível carregar os dados do painel de administração.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">A carregar painel de administração...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Painel de Administração</h1>
                    <p className="text-gray-600 mt-2">Visão geral da plataforma PetCare.</p>
                </header>

                {/* Seção de Estatísticas Principais */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        icon={<Users size={24} />} 
                        title="Total de Usuários" 
                        value={stats?.totalUsers || 0} 
                        colorClass="blue"
                    />
                    <StatCard 
                        icon={<DollarSign size={24} />} 
                        title="Receita Total (Mês)" 
                        value={brl.format(stats?.monthlyRevenue || 0)}
                        colorClass="green"
                    />
                    <StatCard 
                        icon={<ClipboardList size={24} />} 
                        title="Total de Agendamentos" 
                        value={stats?.totalAppointments || 0}
                        colorClass="yellow"
                    />
                </section>

                <main className="space-y-8">
                    {/* Seção de Ações Rápidas */}
                    <section className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gerenciamento</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <Link to="/admin/sitters" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                                <Users className="text-blue-600 mb-2" size={28} />
                                <span className="font-semibold text-center text-gray-700">Gerir Sitters</span>
                            </Link>
                            <Link to="/admin/owners" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                                <UserPlus className="text-blue-600 mb-2" size={28} />
                                <span className="font-semibold text-center text-gray-700">Gerir Owners</span>
                            </Link>
                            <Link to="/admin/services" className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                                <Briefcase className="text-blue-600 mb-2" size={28} />
                                <span className="font-semibold text-center text-gray-700">Tipos de Serviço</span>
                            </Link>
                            <Link to="/admin/approvals" className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors relative">
                                {stats?.pendingApprovals > 0 && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {stats.pendingApprovals}
                                    </span>
                                )}
                                <ShieldCheck className="text-red-600 mb-2" size={28} />
                                <span className="font-semibold text-center text-red-700">Aprovações</span>
                            </Link>
                        </div>
                    </section>
                    
                    {/* Seção para listas ou relatórios futuros */}
                    <section className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Relatórios e Atividades Recentes</h2>
                        <div className="text-center text-gray-500 py-8">
                            <p>Área para exibir os últimos usuários cadastrados, agendamentos recentes ou gráficos.</p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}