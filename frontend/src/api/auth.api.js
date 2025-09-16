// frontend/src/api/auth.api.js
import { post } from './http.js';

export async function login({ email, password }) {
  const data = await post('/auth/login', { email, password });
  if (data?.token) localStorage.setItem('jwt', data.token);
  return data;
}

export async function register(payload) {
  // payload: { name, email, password, role }
  return post('/auth/register', payload);
}

export async function logout() {
  localStorage.removeItem('jwt');
  // se tiver logout no backend: await post('/auth/logout');
  return { ok: true };
}
