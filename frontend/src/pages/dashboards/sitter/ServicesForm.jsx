import React, { useState } from 'react';
import { Dog, PawPrint, Home } from 'lucide-react';

// Dados iniciais que poderiam vir da API
const initialServicesData = {
  babysitting: { active: true, price: 50 },
  walking: { active: true, price: 30 },
  hosting: { active: false, price: 100 },
};

// Componente para o "interruptor" (toggle)
function Toggle({ active, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onChange}
      className={`${
        active ? 'bg-indigo-600' : 'bg-slate-300'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
      <span
        className={`${
          active ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
}

export default function ServicesForm() {
  const [services, setServices] = useState(initialServicesData);

  // Função para atualizar o estado de um serviço (ativo/inativo)
  const handleToggle = (serviceName) => {
    setServices(prev => ({
      ...prev,
      [serviceName]: { ...prev[serviceName], active: !prev[serviceName].active },
    }));
  };

  // Função para atualizar o preço de um serviço
  const handlePriceChange = (serviceName, newPrice) => {
    // Garante que o preço não seja negativo
    const price = Math.max(0, parseFloat(newPrice) || 0);
    setServices(prev => ({
      ...prev,
      [serviceName]: { ...prev[serviceName], price },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você enviaria os dados `services` para a sua API
    console.log('Salvando serviços:', services);
    alert('Serviços salvos com sucesso! (ver console)');
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 text-slate-800">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Meus Serviços</h1>
          <p className="text-slate-600 mt-1">Ative ou desative os serviços que você oferece e defina seus preços.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-8">
          
          {/* Serviço: Babá de Pet */}
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Dog className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">Babá de Pet</h3>
              </div>
              <Toggle active={services.babysitting.active} onChange={() => handleToggle('babysitting')} />
            </div>
            <p className="text-sm text-slate-500 mb-4">Cuide do pet na casa do cliente por um período determinado.</p>
            <div>
              <label htmlFor="babysitting-price" className="block text-sm font-medium text-slate-700 mb-1">Preço por hora (R$)</label>
              <input
                type="number"
                id="babysitting-price"
                value={services.babysitting.price}
                onChange={(e) => handlePriceChange('babysitting', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!services.babysitting.active}
              />
            </div>
          </div>

          {/* Serviço: Passeio */}
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <PawPrint className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">Passeio</h3>
              </div>
              <Toggle active={services.walking.active} onChange={() => handleToggle('walking')} />
            </div>
            <p className="text-sm text-slate-500 mb-4">Leve os pets para um passeio divertido e seguro de 30 minutos.</p>
            <div>
              <label htmlFor="walking-price" className="block text-sm font-medium text-slate-700 mb-1">Preço por passeio (R$)</label>
              <input
                type="number"
                id="walking-price"
                value={services.walking.price}
                onChange={(e) => handlePriceChange('walking', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!services.walking.active}
              />
            </div>
          </div>

          {/* Serviço: Hospedagem */}
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Home className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">Hospedagem</h3>
              </div>
              <Toggle active={services.hosting.active} onChange={() => handleToggle('hosting')} />
            </div>
            <p className="text-sm text-slate-500 mb-4">Receba os pets na sua casa com todo o carinho e cuidado.</p>
            <div>
              <label htmlFor="hosting-price" className="block text-sm font-medium text-slate-700 mb-1">Preço por diária (R$)</label>
              <input
                type="number"
                id="hosting-price"
                value={services.hosting.price}
                onChange={(e) => handlePriceChange('hosting', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!services.hosting.active}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
