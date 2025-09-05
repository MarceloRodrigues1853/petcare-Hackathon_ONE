import { useEffect, useState } from "react";
// CORREÇÃO: O caminho foi ajustado para subir três níveis (../../../)
import { getProfile, updateProfile } from "../../../api/sitter";

export default function SitterProfileEdit() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Falha ao buscar perfil:", error);
        setFeedback({ message: 'Não foi possível carregar seu perfil.', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ message: '', type: '' });
    try {
      const response = await updateProfile(profile);
      setFeedback({ message: response.message, type: 'success' });
    } catch (error) {
      setFeedback({ message: error.message || 'Falha ao atualizar. Tente novamente.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">A carregar o seu perfil...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Editar Perfil</h1>
          <p className="text-gray-600 mt-2">Mantenha as suas informações sempre atualizadas.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              name="name"
              id="name"
              value={profile.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={profile.email}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            />
             <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado.</p>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={profile.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Sobre mim</label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={profile.bio}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Fale um pouco sobre a sua experiência com animais..."
            ></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {saving ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </div>
        </form>
         {feedback.message && (
             <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.message}
             </div>
        )}
      </div>
    </div>
  );
}
