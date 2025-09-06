// ATENÇÃO: Este é um arquivo de MOCK (simulação).
// O objetivo é fazer os componentes do frontend funcionarem sem precisar de um backend real.
// No futuro, você irá substituir o conteúdo destas funções por chamadas reais usando o 'http.js'.

// Simula a busca de estatísticas do Sitter
export async function getSitterStats() {
  console.log("API MOCK: Buscando estatísticas do Sitter...");
  // Atraso para simular uma chamada de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalAppointments: 42,
    monthlyRevenue: 1250.75,
    rating: 4.8,
  };
}

// Simula a busca dos próximos agendamentos
export async function getUpcomingAppointments() {
  console.log("API MOCK: Buscando próximos agendamentos...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 1, clientName: 'Ana Silva', service: 'Passeio', date: '2025-09-06T10:00:00Z', petName: 'Bolinha' },
    { id: 2, clientName: 'Carlos Souza', service: 'Hospedagem', date: '2025-09-08T18:00:00Z', petName: 'Rex' },
  ];
}

// Simula a busca dos serviços oferecidos pelo Sitter
export async function getMyServices() {
    console.log("API MOCK: Buscando serviços do Sitter...");
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        walking: { active: true, price: 25.00 },
        sitting: { active: true, price: 80.00 },
        hosting: { active: false, price: 150.00 },
    };
}

// Simula o salvamento dos serviços
export async function saveMyServices(services) {
    console.log("API MOCK: Salvando serviços...", services);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Em uma aplicação real, você receberia uma confirmação do backend
    return { success: true, message: "Serviços salvos com sucesso!" };
}

// Simula a busca do perfil
export async function getProfile() {
    console.log("API MOCK: Buscando perfil...");
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        name: 'João da Silva',
        email: 'joao.sitter@example.com',
        phone: '11987654321',
        bio: 'Amante de animais com mais de 5 anos de experiência cuidando de cães e gatos.'
    };
}

// Simula a atualização do perfil
export async function updateProfile(profileData) {
    console.log("API MOCK: Atualizando perfil...", profileData);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: "Perfil atualizado com sucesso!" };
}

// Simula a busca de agendamentos
export async function getAppointments() {
    console.log("API MOCK: Buscando todos os agendamentos...");
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 1, client: 'Ana Silva', pet: 'Bolinha', service: 'Passeio', date: '2025-09-06', status: 'Confirmado' },
        { id: 2, client: 'Carlos Souza', pet: 'Rex', service: 'Hospedagem', date: '2025-09-08', status: 'Confirmado' },
        { id: 3, client: 'Mariana Lima', pet: 'Mimi', service: 'Babá de Pet', date: '2025-09-05', status: 'Concluído' },
    ];
}