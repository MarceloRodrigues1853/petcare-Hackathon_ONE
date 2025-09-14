import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, Instagram, Facebook } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

// 1. Importando as funções NOVAS e CORRETAS
import { getOwnerById, updateOwner } from "../../../api/owner.api.js";

export default function OwnerProfileEdit() {
  const { user } = useAuth(); // 2. Pegando o usuário logado para saber o ID
  const [profile, setProfile] = useState({ 
    name: '', email: '', phone: '', imageUrl: null,
    address: { street: '', number: '', neighborhood: '', city: '', state: '', zip: '' },
    socials: { instagram: '', facebook: '' }, 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return; // Só busca se tivermos um ID de usuário

    try {
      setLoading(true);
      // 3. Buscando o perfil com a função correta, passando o ID
      const data = await getOwnerById(user.id);
      // Merge seguro para preencher o formulário sem quebrar o estado inicial
      setProfile(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Falha ao buscar perfil:", error);
      setFeedback({ message: 'Não foi possível carregar seu perfil.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Sua função de lidar com inputs aninhados está perfeita, sem mudanças!
  const handleNestedChange = (section) => (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [section]: { ...prev[section], [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setFeedback({ message: '', type: '' });
    try {
      // 4. PREPARANDO O PAYLOAD PARA A API
      // Enviamos apenas os campos que a API aceita no momento (name, email).
      // O campo 'password' não deve ser enviado vazio. A mudança de senha
      // geralmente é feita em um formulário separado.
      const payload = {
        name: profile.name,
        email: profile.email,
        // Quando o backend for atualizado, você adicionará os outros campos aqui:
        // phone: profile.phone,
        // address: profile.address,
        // socials: profile.socials,
      };

      // 5. Chamando a função de update correta, passando o ID e o payload
      await updateOwner(user.id, payload);
      setFeedback({ message: "Perfil atualizado com sucesso!", type: 'success' });
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
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/owner/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Editar Perfil</h1>
            <p className="text-gray-600 mt-2">Mantenha as suas informações atualizadas.</p>
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
            </div>
          </div>

          {/*SECÇÃO: Endereço */}
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

          {/*SECÇÃO: Redes Sociais */}
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

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
              {saving ? 'Salvando...' : 'Salvar Alterações'}
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