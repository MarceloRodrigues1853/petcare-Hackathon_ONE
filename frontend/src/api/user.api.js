// src/api/user.api.js
import http from './http.js';

// Lista todos os usuários (Admin)
export function listAllUsers() {
  return http.get('/users');
}

// Busca um usuário por id (para AuthContext e perfis)
export function getUserById(id) {
  return http.get(`/users/${id}`);
}
