// src/pages/dashboards/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { listAllUsers } from '@/api/user.api.js';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await listAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        setError((err?.message || 'Falha ao carregar usuários').toString());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Carregando...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin • Usuários</h1>
      {users.length === 0 ? (
        <p className="text-gray-500">Nenhum usuário encontrado.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Nome</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b">
                <td className="py-2">{u.id}</td>
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
