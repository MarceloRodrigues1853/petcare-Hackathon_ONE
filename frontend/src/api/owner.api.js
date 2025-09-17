// src/api/owner.api.js
import { get, post, put, del } from './http.js';

// --- Funções para o ADMIN gerir Owners ---

/**
 * Lista todos os owners (usado na página de admin).
 * Endpoint: GET /api/owners
 */
export function listOwners() {
  return get('/api/owners');
}

/**
 * Deleta um owner específico (usado na página de admin).
 * Endpoint: DELETE /api/owners/{ownerId}
 */
export function deleteOwner(ownerId) {
  return del(`/api/owners/${ownerId}`);
}


// --- Funções para o OWNER gerir o seu próprio perfil e dados ---

/**
 * Busca os dados de um owner específico pelo ID (usado no Dashboard e Perfil).
 * Endpoint: GET /api/owners/{ownerId}
 */
export function getOwnerById(ownerId) {
  return get(`/api/owners/${ownerId}`);
}

/**
 * Atualiza o perfil de um owner.
 * Endpoint: PUT /api/owners/{ownerId}
 */
export function updateOwner(ownerId, profileData) {
  return put(`/api/owners/${ownerId}`, profileData);
}

/**
 * Busca a lista de pets de um owner específico.
 * Endpoint (Sugestão): GET /api/owners/{ownerId}/pets
 */
export function getMyPets(ownerId) {
  return get(`/api/owners/${ownerId}/pets`);
}

/**
 * Busca a lista de agendamentos de um owner específico.
 * Endpoint (Sugestão): GET /api/owners/{ownerId}/appointments
 */
export function getMyAppointments(ownerId) {
  return get(`/api/owners/${ownerId}/appointments`);
}