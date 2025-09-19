//
// CAMINHO: src/pages/Admin/AdminDashboard.jsx
//
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, DollarSign, ClipboardList, Briefcase, ShieldCheck } from "lucide-react";
// IMPORTAMOS A FUNÇÃO REAL DA API
import { getAdminStats } from "../../api/admin";

// Componente StatCard (não muda)
function StatCard({ icon, title, value, colorClass = "blue" }) {
    const colors = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        red: "bg-red-100 text-red-600",
    };
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
            <div className={`p-3 rounded-full ${colors[colorClass]}`}>{icon}</div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

// Componente principal do Dashboard
export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    // ESTE É O CORAÇÃO DA MUDANÇA
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // ANTES: Você tinha uma função mock aqui.
                // AGORA: Chamamos a função real que busca no backend.
                const statsData = await getAdminStats();
                setStats(statsData);
            } catch (error) {
                console.error("Falha ao carregar dados do dashboard de admin:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []); // O array vazio [] significa que isso roda uma vez quando o componente carrega

    if (loading) {
        return <div className="p-8 text-center text-gray-500">A carregar painel de administração...</div>;
    }

    // O resto do seu código JSX continua exatamente igual
    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Painel de Administração</h1>
                    <p className="text-gray-600 mt-2">Visão geral da plataforma PetCare.</p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard icon={<Users size={24} />} title="Total de Usuários" value={stats?.totalUsers || 0} />
                    <StatCard icon={<DollarSign size={24} />} title="Receita Total (Mês)" value={brl.format(stats?.monthlyRevenue || 0)} colorClass="green" />
                    <StatCard icon={<ClipboardList size={24} />} title="Total de Agendamentos" value={stats?.totalAppointments || 0} colorClass="yellow" />
                </section>
                
                <main className="space-y-8">
                    {/* O restante do seu JSX aqui */}
                </main>
            </div>
        </div>
    );
}