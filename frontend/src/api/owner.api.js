// api/owner.api.js
import { get, post, put, del } from './http.js';

/**
 * Busca os dados de um owner pelo ID. Usado para carregar o perfil.
 * Endpoint: GET /owners/{id}
 */
export function getOwnerById(ownerId) {
  return get(`/owners/${ownerId}`);
}

/**
 * Atualiza o perfil de um owner.
 * Endpoint: PUT /owners/{id}
 */
export function updateOwner(ownerId, profileData) {
  // A API espera: { name, email, password }
  return put(`/owners/${ownerId}`, profileData);
}

// Outras funções de gerenciamento (mais usadas por admins)
export function listOwners() { return get('/owners'); }
export function createOwner(ownerData) { return post('/owners', ownerData); }
export function deleteOwner(ownerId) { return del(`/owners/${ownerId}`); }