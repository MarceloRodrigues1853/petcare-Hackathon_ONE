// src/api/auth.api.js
import { post } from './http.js';

export function register(userData) {
  return post("/api/auth/register", userData);
}

export function login(credentials) {
  return post("/api/auth/login", credentials);
}

export function logout() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user'); // Garante que o usuário também é removido
}