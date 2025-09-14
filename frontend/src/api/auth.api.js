// api/auth.api.js
import { post } from './http.js';

/**
 * Registra um novo usuário.
 * Endpoint: POST /api/auth/register
 */
export function register(userData) {
  // A API espera: { name, email, password, role }
  return post("/api/auth/register", userData);
}

/**
 * Realiza o login do usuário.
 * Endpoint: POST /api/auth/login
 */
export function login(credentials) {
  // A API espera: { email, password }
  // O Frontend espera a resposta: { token, role, name, email }
  return post("/api/auth/login", credentials);
}

/**
 * Remove o token do localStorage para deslogar.
 */
export function logout() {
  localStorage.removeItem('jwt');
}