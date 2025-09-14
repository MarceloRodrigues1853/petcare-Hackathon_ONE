// api/user.api.js
import { get } from './http.js';

/**
 * Lista todos os usuários. (Rota de Admin)
 * Endpoint: GET /api/users
 */
export function listAllUsers() {
  return get('/api/users');
}

/**
 * Busca os dados de um usuário pelo ID.
 * Endpoint: GET /api/users/{id}
 */
export function getUserById(userId) {
  return get(`/api/users/${userId}`);
}