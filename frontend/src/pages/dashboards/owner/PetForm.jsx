import { useEffect, useState } from "react";
import { getPets, savePet, removePet } from "../../../api/owner";
import { Link } from "react-router-dom";
import { Dog, ArrowLeft } from "lucide-react";

export default function PetForm() {
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({ name: "", species: "", age: "" });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);
        const data = await getPets();
        setPets(data);
      } catch (error) {
        setFeedback({ type: "error", message: "Falha ao carregar pets." });
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await savePet(newPet); // salva no backend mock
      setFeedback({ type: "success", message: res.message });
      setPets((prev) => [...prev, { ...newPet, id: Date.now() }]); // adiciona na lista local
      setNewPet({ name: "", species: "", age: "" });
    } catch (error) {
      setFeedback({ type: "error", message: "Erro ao salvar pet." });
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await removePet(id); // remove do backend mock
      setPets((prev) => prev.filter((pet) => pet.id !== id));
      setFeedback({ type: "success", message: res.message });
    } catch (error) {
      setFeedback({ type: "error", message: "Erro ao remover pet." });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Botão voltar */}
        <header className="mb-8 relative flex items-center">
          <Link to="/owner/dashboard" className="mr-4 p-2 text-blue-600 hover:bg-gray-200 rounded-full transition-colors" title="Voltar">
            <ArrowLeft size={28} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Meu Pet</h1>
            <p className="text-gray-600 mt-2">Cadastre e atualize os dados do(s) seu(s) pet(s)</p>
          </div>
        </header>
        
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              name="name"
              value={newPet.name}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Espécie
            </label>
            <input
              name="species"
              value={newPet.species}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Idade
            </label>
            <input
              name="age"
              type="number"
              value={newPet.age}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Salvar Pet
          </button>
        </form>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Lista de pets */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Lista de Pets</h3>
          {loading ? (
            <p>Carregando pets...</p>
          ) : pets.length === 0 ? (
            <p className="text-gray-600">Nenhum pet cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {pets.map((pet) => (
                <li
                  key={pet.id}
                  className="bg-white p-3 rounded-lg shadow flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 text-green-700 p-2 rounded-full">
                      <Dog size={20} />
                    </div>
                    <span>
                      {pet.name} - {pet.species} ({pet.age} anos)
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(pet.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
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