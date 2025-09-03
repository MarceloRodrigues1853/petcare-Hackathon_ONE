// src/api/auth.js
import { postJson } from './http';

export async function loginApi(email, password) {
  return postJson('/auth/login', { email, password });
}

export async function registerApi(payload) {
  return postJson('/auth/register', payload);
}
