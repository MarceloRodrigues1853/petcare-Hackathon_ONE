import { get, post, put, del } from './http.js';

// ==========================
// Serviços do sitter
// ==========================
export async function getServices() {
  return get('/sitter/services');
}

export async function createService(data) {
  return post('/sitter/services', data);
}

export async function updateService(id, data) {
  return put(`/sitter/services/${id}`, data);
}

export async function deleteService(id) {
  return del(`/sitter/services/${id}`);
}

// ==========================
// Estatísticas do sitter
// ==========================
export async function getSitterStats() {
  return get('/sitter/stats');
}

// ==========================
// Agendamentos do sitter
// ==========================
export async function getUpcomingAppointments() {
  return get('/sitter/appointments/upcoming');
}

// ==========================
// Perfil do sitter
// ==========================
export async function getProfile() {
  return get('/sitter/profile');
}

export async function updateProfile(data) {
  return put('/sitter/profile', data);
}

// ==========================
// Default export para compatibilidade
// ==========================
export default {
  getServices,
  createService,
  updateService,
  deleteService,
  getSitterStats,
  getUpcomingAppointments,
  getProfile,
  updateProfile
};