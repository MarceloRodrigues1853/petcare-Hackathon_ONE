// frontend/src/api/http.js

const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/+$/, '');

function getAuthHeader() {
  const token = localStorage.getItem('jwt'); // mantém 'jwt' como chave padrão
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// monta URL final usando a base e evita duplicar /api
function buildUrl(path) {
  let p = path.startsWith('/') ? path : `/${path}`;
  // Se API_BASE já termina com /api e o path também começa com /api, remove um
  if (API_BASE.endsWith('/api') && p.startsWith('/api')) {
    p = p.replace(/^\/api/, '');
  }
  return `${API_BASE}${p}`;
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = buildUrl(path);

  const finalHeaders = {
    ...getAuthHeader(),
    ...(!(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
      credentials: 'include',
    });
  } catch {
    throw new Error('Falha de rede. Verifique a sua conexão.');
  }

  if (!res.ok) {
    let message = `Erro HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {}
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export const get  = (url, opts) => request(url, { method: 'GET', ...opts });
export const post = (url, body, opts) => request(url, { method: 'POST', body, ...opts });
export const put  = (url, body, opts) => request(url, { method: 'PUT',  body, ...opts });
export const del  = (url, opts) => request(url, { method: 'DELETE', ...opts });

export default { get, post, put, del };
