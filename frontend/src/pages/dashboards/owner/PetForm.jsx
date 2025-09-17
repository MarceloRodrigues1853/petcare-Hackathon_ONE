import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Dog, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// 1. Importando as funções REAIS da nossa API de pets
import { listPets, createPet, deletePet } from "@/api/pet.api.js";

export default function PetForm() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({ name: "", species: "", age: "" });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. A busca de pets agora chama a API real
  const fetchPets = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await listPets();
      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      setFeedback({ type: "error", message: "Falha ao carregar seus pets." });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
        setFeedback({ type: "error", message: "Usuário não encontrado. Faça login novamente." });
        return;
    }
    try {
      setFeedback(null);
      // 3. Montando o payload com os nomes que o backend espera
      const petPayload = {
        nome: newPet.name,
        especie: newPet.species,
        idade: parseInt(newPet.age, 10),
        ownerId: user.id,
      };

      // 4. Chamando a função 'createPet' real da API
      const createdPet = await createPet(petPayload);

      // Atualiza a lista local com o pet retornado pelo backend (que tem o ID correto)
      setPets((prev) => [...prev, createdPet]);
      setFeedback({ type: "success", message: `"${createdPet.nome}" salvo com sucesso!` });
      setNewPet({ name: "", species: "", age: "" }); // Limpa o formulário

    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Erro ao salvar pet." });
    }
  };

  const handleRemove = async (id) => {
    const petNameToRemove = pets.find(p => p.id === id)?.nome || 'O pet';
    if (!window.confirm(`Tem certeza que deseja remover "${petNameToRemove}"?`)) {
        return;
    }
    try {
      setFeedback(null);
      // 5. Chamando a função 'deletePet' real da API
      await deletePet(id);
      setPets((prev) => prev.filter((pet) => pet.id !== id));
      setFeedback({ type: "success", message: `"${petNameToRemove}" removido com sucesso.` });
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Erro ao remover pet." });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 relative flex items-center">
          <Link to="/owner/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meus Pets</h1>
            <p className="text-gray-600 mt-2">Cadastre e atualize os dados do(s) seu(s) pet(s)</p>
          </div>
        </header>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input name="name" value={newPet.name} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Espécie</label>
            <input name="species" value={newPet.species} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Idade</label>
            <input name="age" type="number" value={newPet.age} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
            Salvar Pet
          </button>
        </form>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center font-medium ${ feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`}>
            {feedback.message}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Lista de Pets Cadastrados</h3>
          {loading ? (
            <p className="text-gray-500">A carregar pets...</p>
          ) : pets.length === 0 ? (
            <p className="text-gray-600">Nenhum pet cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {pets.map((pet) => (
                <li key={pet.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 text-green-700 p-2 rounded-full">
                      <Dog size={20} />
                    </div>
                    <span>
                      {/* 6. Usando os nomes de campo da API (nome, especie, idade) */}
                      {pet.nome} - {pet.especie} ({pet.idade} anos)
                    </span>
                  </div>
                  <button onClick={() => handleRemove(pet.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}