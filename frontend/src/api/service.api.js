// api/service.api.js
import { get, post, put, del } from './http.js';

/**
 * Lista todos os serviços base (ex: "Passeio", "Hospedagem").
 * Endpoint: GET /api/servicos
 */
export function listAllServices() {
  return get('/api/servicos');
}

/**
 * Busca um serviço específico pelo ID.
 * Endpoint: GET /api/servicos/{id}
 */
export function getServiceById(id) {
  return get(`/api/servicos/${id}`);
}

// Funções geralmente usadas por administradores:
export function createService(serviceData) { return post('/api/servicos', serviceData); }
export function updateService(id, serviceData) { return put(`/api/servicos/${id}`, serviceData); }
export function deleteService(id) { return del(`/api/servicos/${id}`); }