import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, Instagram, Facebook } from "lucide-react";
// O caminho da sua API simulada. Garanta que ela exporta 'getProfile' e 'updateProfile'.
import { getProfile, updateProfile } from "@/api/sitter.js";

// Componente para os botões de preferência de pet
function PreferenceButton({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 p-3 text-sm font-semibold rounded-lg border-2 transition-colors ${
        isActive 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
      }`}
    >
      {label}
    </button>
  );
}

export default function SitterProfileEdit() {
  const [profile, setProfile] = useState({ 
    name: '', email: '', phone: '', bio: '', imageUrl: null,
    address: { street: '', number: '', neighborhood: '', city: '', state: '', zip: '' },
    socials: { instagram: '', facebook: '' },
    preferences: { smallDogs: false, mediumDogs: false, largeDogs: false, cats: false } 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(prev => ({ ...prev, ...data }));
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

  const handleNestedChange = (section) => (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [name]: value
        }
    }));
  };
  
  const handlePreferenceToggle = (preferenceKey) => {
      setProfile(prev => ({
          ...prev,
          preferences: { ...prev.preferences, [preferenceKey]: !prev.preferences[preferenceKey] }
      }));
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
    return <div className="p-8 text-center text-gray-500">A carregar o seu perfil...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/sitter/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Editar Perfil</h1>
            <p className="text-gray-600 mt-2">Mantenha as suas informações atualizadas para atrair mais clientes.</p>
          </div>
        </header>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações Pessoais</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                <div className="flex items-center gap-4">
                  <img src={profile.imageUrl || `https://placehold.co/100x100/E2E8F0/475569?text=Perfil`} alt="Foto do Perfil" className="w-24 h-24 rounded-full object-cover" />
                  <label htmlFor="photo-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
                    <UploadCloud size={16} /> Alterar Foto
                  </label>
                  <input type="file" id="photo-upload" className="hidden" />
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value={profile.email} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="tel" name="phone" id="phone" value={profile.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Sobre Mim</label>
                <textarea name="bio" id="bio" rows={4} value={profile.bio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
            </div>
          </div>

          {/* NOVA SECÇÃO: Endereço */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Endereço</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Rua</label>
                <input type="text" name="street" id="street" value={profile.address.street} onChange={handleNestedChange('address')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700">Número</label>
                <input type="text" name="number" id="number" value={profile.address.number} onChange={handleNestedChange('address')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
               <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Bairro</label>
                <input type="text" name="neighborhood" id="neighborhood" value={profile.address.neighborhood} onChange={handleNestedChange('address')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
                <input type="text" name="city" id="city" value={profile.address.city} onChange={handleNestedChange('address')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                <input type="text" name="state" id="state" value={profile.address.state} onChange={handleNestedChange('address')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>
          
          {/* NOVA SECÇÃO: Redes Sociais */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Redes Sociais</h2>
            <div className="space-y-4">
              <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Instagram size={16} className="text-gray-400" /></div>
                    <input type="text" name="instagram" id="instagram" value={profile.socials.instagram} onChange={handleNestedChange('socials')} placeholder="seu_usuario" className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
              </div>
              <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                   <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Facebook size={16} className="text-gray-400" /></div>
                    <input type="text" name="facebook" id="facebook" value={profile.socials.facebook} onChange={handleNestedChange('socials')} placeholder="seuperfil" className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferências de Pet</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Porte dos cães que aceita</label>
                    <div className="flex gap-2">
                        <PreferenceButton label="Pequeno" isActive={profile.preferences.smallDogs} onClick={() => handlePreferenceToggle('smallDogs')} />
                        <PreferenceButton label="Médio" isActive={profile.preferences.mediumDogs} onClick={() => handlePreferenceToggle('mediumDogs')} />
                        <PreferenceButton label="Grande" isActive={profile.preferences.largeDogs} onClick={() => handlePreferenceToggle('largeDogs')} />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Outros pets</label>
                    <div className="flex gap-2">
                        <PreferenceButton label="Gatos" isActive={profile.preferences.cats} onClick={() => handlePreferenceToggle('cats')} />
                    </div>
                </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
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

