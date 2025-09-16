// frontend/src/api/http.js
const API = import.meta.env.VITE_API_BASE || '/api';

function isJson(res) {
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json');
}

function normalizeToken(raw) {
  if (!raw) return null;
  return raw.startsWith('Bearer ') ? raw.slice(7) : raw;
}

function authHeader() {
  const stored = localStorage.getItem('jwt');
  const token = normalizeToken(stored);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const hasFormData = body instanceof FormData;

  const res = await fetch(`${API}${path}`, {
    method,
    // Se você não usa cookies de sessão, pode remover a próxima linha
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(hasFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeader(),
      ...headers,
    },
    body: hasFormData ? body : (body ? JSON.stringify(body) : undefined),
  });

  let data;
  try {
    data = isJson(res) ? await res.json() : await res.text();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // repassa 401 de forma explícita (útil pro redirecionamento)
    if (res.status === 401) throw new Error('HTTP 401');
    const msg =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data.slice(0, 200)) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

// ===== Named exports esperados pelos outros módulos =====
export const get  = (p, opts)        => request(p, { ...opts, method: 'GET' });
export const post = (p, body, opts)  => request(p, { ...opts, method: 'POST', body });
export const put  = (p, body, opts)  => request(p, { ...opts, method: 'PUT',  body });
export const del  = (p, opts)        => request(p, { ...opts, method: 'DELETE' });

// ===== Default export opcional (caso alguém use) =====
const http = { get, post, put, del };
export default http;
