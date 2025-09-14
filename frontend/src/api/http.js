// api/http.js
const API_BASE_URL = import.meta.env.VITE_API_BASE; // Ex: VITE_API_BASE=http://localhost:8080

function getAuthHeader() {
  const token = localStorage.getItem('jwt');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body, opts = {}) {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
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