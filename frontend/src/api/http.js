<<<<<<< HEAD
// api/http.js
const API_BASE_URL = import.meta.env.VITE_API_BASE; // Ex: VITE_API_BASE=http://localhost:8080

function getAuthHeader() {
  const token = localStorage.getItem('jwt');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body, opts = {}) {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
=======
const API = import.meta.env.VITE_API_BASE; 

function authHeader() {
  const t = localStorage.getItem('jwt');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(method, path, body, opts = {}) {
  const res = await fetch(`${API}${path}`, {
>>>>>>> feature/admin-wip
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...getAuthHeader(),
      ...(opts.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });

  if (!response.ok) {
    let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (e) {
      // Ignora erro de parsing se o corpo não for JSON.
    }
    throw new Error(errorMessage);
  }

  return response.status === 204 ? null : response.json();
}

<<<<<<< HEAD
export function get(path, opts) {
  return request('GET', path, null, opts);
}

export function post(path, body, opts) {
  return request('POST', path, body, opts);
}

export function put(path, body, opts) {
  return request('PUT', path, body, opts);
}

export function del(path, opts) {
  return request('DELETE', path, null, opts);
}

export default { get, post, put, del };
=======
// Funções principais
export async function get(path, opts) {
  return request('GET', path, null, opts);
}

// Função principal de POST
export async function postJson(path, body, opts) {
  return request('POST', path, body, opts);
}

// Alias 'post' para compatibilidade com código antigo
export const post = postJson;

export async function put(path, body, opts) {
  return request('PUT', path, body, opts);
}

export async function del(path, opts) {
  return request('DELETE', path, null, opts);
}

// Default export incluindo todos os métodos
export default { get, post, postJson, put, del };
>>>>>>> feature/admin-wip
