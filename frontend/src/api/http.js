const API = import.meta.env.VITE_API_BASE; 

function authHeader() {
  const t = localStorage.getItem('jwt');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(method, path, body, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...authHeader(),
      ...(opts.headers || {}),
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.json())?.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

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
