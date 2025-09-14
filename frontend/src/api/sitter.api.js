// api/sitter.api.js
import { get, post, put, del } from './http.js';

/**
 * Lista todos os sitters, com filtro opcional por serviço.
 * Endpoint: GET /api/sitters
 */
export function listSitters(servicoId = null) {
  const path = servicoId ? `/api/sitters?servicoId=${servicoId}` : '/api/sitters';
  return get(path);
}

/**
 * Busca os dados de um sitter pelo ID.
 * Endpoint: GET /api/sitters/{sitterId}
 */
export function getSitterById(sitterId) {
  return get(`/api/sitters/${sitterId}`);
}

/**
 * Atualiza o perfil de um sitter.
 * Endpoint: PUT /api/sitters/{sitterId}
 */
export function updateSitter(sitterId, profileData) {
  // A API espera: { name, email }
  return put(`/api/sitters/${sitterId}`, profileData);
}

// === Serviços de um Sitter ===

/**
 * Lista os serviços que um sitter oferece (com preços).
 * Endpoint: GET /api/sitters/{sitterId}/servicos
 */
export function getSitterServices(sitterId) {
  return get(`/api/sitters/${sitterId}/servicos`);
}

/**
 * Adiciona um serviço ao portfólio de um sitter.
 * Endpoint: POST /api/sitters/{sitterId}/servicos
 */
export function addSitterService(sitterId, serviceData) {
  // A API espera: { servicoId, valor }
  return post(`/api/sitters/${sitterId}/servicos`, serviceData);
}

/**
 * Remove um serviço do portfólio de um sitter.
 * Endpoint: DELETE /api/sitters/{sitterId}/servicos/{servicoPrecoId}
 */
export function deleteSitterService(sitterId, servicoPrecoId) {
  return del(`/api/sitters/${sitterId}/servicos/${servicoPrecoId}`);
}