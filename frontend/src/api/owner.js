// src/api/owner.js
import http from "./http";

/**
 * Dashboard do Dono
 * GET /api/owners/me/dashboard
 * -> { totalPets, totalAgendamentos, valorAPagar, proximosAgendamentos:[{id, petName, serviceName, startDate, price}] }
 */
export async function getOwnerDashboard() {
  const { data } = await http.get("/api/owners/me/dashboard");
  return data;
}

/**
 * Lista agendamentos do Dono (opcional status)
 * GET /api/owners/me/appointments?status=CONFIRMADO
 * -> [{ id, sitterName, petName, service, dataInicio, dataFim, status, valor }]
 */
export async function getAppointments(status) {
  const params = {};
  if (status) params.status = status;
  const { data } = await http.get("/api/owners/me/appointments", { params });
  return data;
}

/**
 * Pets do usuário logado
 * GET /api/pets
 * -> [{ id, nome, especie, idade, ownerId }]
 */
export async function listPets() {
  const { data } = await http.get("/api/pets");
  return data;
}

/**
 * (Opcional) Criar agendamento — quando você expor no backend,
 * alinhe o body aqui com o seu controller.
 * Deixei uma rota sugerida: POST /api/owners/appointments
 */
export async function createAppointment(payload) {
  // Exemplo de corpo compatível com os nomes do front:
  // payload = { petId, service, date }
  try {
    const { data } = await http.post("/api/owners/appointments", payload);
    return data;
  } catch (e) {
    // Enquanto o endpoint não existir, damos um erro amigável
    throw new Error("Endpoint de criação de agendamento ainda não disponível.");
  }
}
