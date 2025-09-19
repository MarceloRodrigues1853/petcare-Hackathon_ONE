//
// CAMINHO: src/api/admin.js
//
import { getJson, postJson, putJson, delJson } from './http';

/**
 * Busca as estatísticas para o dashboard do admin.
 * Rota no Backend: GET /api/admin/dashboard
 */
export function getAdminStats() {
  return getJson('/api/admin/dashboard');
}

/**
 * Busca a lista de sitters. Pode filtrar por status.
 * Rota no Backend: GET /api/admin/sitters
 */
export function getSitters(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return getJson(`/api/admin/sitters${qs ? `?${qs}` : ''}`);
}

/**
 * Atualiza o status de um sitter (APPROVED, REJECTED).
 * Rota no Backend: PUT /api/admin/sitters/{sitterId}/status
 */
export function updateSitterStatus(sitterId, status) {
  return putJson(`/api/admin/sitters/${sitterId}/status`, { status });
}

/**
 * Remove um sitter permanentemente.
 * Rota no Backend: DELETE /api/admin/sitters/{sitterId}
 */
export function deleteSitter(sitterId) {
  return delJson(`/api/admin/sitters/${sitterId}`);
}

/**
 * Busca a lista de donos (owners).
 * Rota no Backend: GET /api/admin/owners
 */
export function getOwners() {
  return getJson('/api/admin/owners');
}

/**
 * Remove um dono permanentemente.
 * Rota no Backend: DELETE /api/admin/owners/{ownerId}
 */
export function deleteOwner(ownerId) {
  return delJson(`/api/admin/owners/${ownerId}`);
}

/**
 * Busca todos os tipos de serviço.
 * Rota no Backend: GET /api/admin/services
 */
export function getServiceTypes() {
  return getJson('/api/admin/services');
}

/**
 * Cria um novo tipo de serviço.
 * Rota no Backend: POST /api/admin/services
 */
export function createServiceType(serviceData) {
  return postJson('/api/admin/services', serviceData);
}

/**
 * Atualiza um tipo de serviço.
 * Rota no Backend: PUT /api/admin/services/{serviceId}
 */
export function updateServiceType(serviceId, serviceData) {
  return putJson(`/api/admin/services/${serviceId}`, serviceData);
}

/**
 * Remove um tipo de serviço.
 * Rota no Backend: DELETE /api/admin/services/{serviceId}
 */
export function deleteServiceType(serviceId) {
  return delJson(`/api/admin/services/${serviceId}`);
}