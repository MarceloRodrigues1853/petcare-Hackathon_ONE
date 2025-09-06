// src/api/owner.js (MOCK)

// --- Perfil do Owner ---
export async function getProfile() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    name: "Maria Oliveira",
    email: "maria.owner@example.com",
    phone: "(11) 99999-8888",
    imageUrl: null,
    address: {
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zip: "01000-000",
    },
    socials: {
      instagram: "maria_oliveira",
      facebook: "maria.oliveira",
    },
  };
}

export async function updateProfile(profileData) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("API MOCK: Atualizando perfil do Owner...", profileData);
  return { success: true, message: "Perfil atualizado com sucesso!" };
}

// --- Pets (persistência simulada em memória) ---
let petsDB = [
  { id: 1, name: "Rex", species: "Cachorro", age: 3 },
  { id: 2, name: "Mia", species: "Gato", age: 2 },
];

export async function getPets() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...petsDB];
}

export async function savePet(petData) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newPet = { ...petData, id: Date.now() };
  petsDB.push(newPet);
  console.log("API MOCK: Salvando pet...", newPet);
  return { success: true, message: "Pet salvo com sucesso!" };
}

export async function removePet(petId) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  petsDB = petsDB.filter((pet) => pet.id !== petId);
  console.log("API MOCK: Removendo pet...", petId);
  return { success: true, message: "Pet removido com sucesso!" };
}

// --- Agendamentos ---
let appointmentsDB = [
  { id: 1, pet: "Rex", date: "2025-09-10", service: "Babá de Pets", price: 50 },
  { id: 2, pet: "Mia", date: "2025-09-12", service: "Passeio", price: 55 },
];

export async function getAppointments() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...appointmentsDB];
}

export async function createAppointment(appointmentData) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newAppointment = { ...appointmentData, id: Date.now() };
  appointmentsDB.push(newAppointment);
  console.log("API MOCK: Criando agendamento...", newAppointment);
  return { success: true, message: "Agendamento criado com sucesso!" };
}

// --- Serviços disponíveis ---
export const services = [
  { name: "Babá de Pets", price: 50, unit: "/visita" },
  { name: "Passeio", price: 55, unit: "/passeio" },
  { name: "Hospedagem", price: 60, unit: "/dia" },
];

// // Exportando tudo junto para evitar erros de import
// export {
//   getProfile,
//   updateProfile,
//   getPets,
//   savePet,
//   removePet,
//   getAppointments,
//   createAppointment,
// };
