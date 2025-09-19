// src/api/sitter.js
import { getJson, postJson, putJson } from './http';

// Painel (cards)
export function getSitterStats() {
  // -> GET /api/sitters/me/dashboard
  return getJson('/sitters/me/dashboard');
}

// Próximos agendamentos (cards + lista)
export function getUpcomingAppointments(limit = 5) {
  // -> GET /api/sitters/me/appointments?future=true&limit=5
  return getJson(`/sitters/me/appointments?future=true&limit=${limit}`);
}

// Lista geral de agendamentos do sitter (com filtros)
export function getAppointments(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return getJson(`/sitters/me/appointments${qs ? `?${qs}` : ''}`);
}

// Serviços do sitter
export function getMyServices() {
  // -> GET /api/sitters/me/services
  return getJson('/sitters/me/services');
}
export function saveMyServices(services) {
  // -> POST /api/sitters/me/services  (payload: { walking:{active,price}, ... })
  return postJson('/sitters/me/services', services);
}

// Perfil do sitter
export function getProfile() {
  // -> GET /api/sitters/me/profile
  return getJson('/sitters/me/profile');
}
export function updateProfile(payload) {
  // -> PUT /api/sitters/me/profile
  return putJson('/sitters/me/profile', payload);
}
