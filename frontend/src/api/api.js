import http from "./http";

// Perfil
export async function getProfile(sitterId) {
  return http.get(`/api/sitters/${sitterId}`);
}
export async function updateProfile(sitterId, profileData) {
  return http.put(`/api/sitters/${sitterId}`, profileData);
}

// Serviços
export async function getMyServices(sitterId) {
  return http.get(`/api/sitters/${sitterId}/servicos`);
}
export async function saveMyServices(sitterId, service) {
  return http.post(`/api/sitters/${sitterId}/servicos`, service);
}
export async function deleteService(sitterId, serviceId) {
  return http.del(`/api/sitters/${sitterId}/servicos/${serviceId}`);
}

// Estatísticas
export async function getSitterStats(sitterId) {
  return http.get(`/api/sitters/${sitterId}/stats`);
}

// Agendamentos
export async function getAppointments() {
  return http.get(`/appointments`); // alinhar com backend
}
export async function getUpcomingAppointments() {
  return http.get(`/appointments/upcoming`); // precisa existir no backend
}