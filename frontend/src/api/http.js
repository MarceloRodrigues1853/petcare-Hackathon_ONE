// src/api/http.js
const API = import.meta.env.VITE_API_BASE || '/api';

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
    credentials: 'include', // ok manter, mesmo que não use cookies
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.json())?.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

export const getJson  = (p, o) => request('GET', p, null, o);
export const postJson = (p, b, o) => request('POST', p, b, o);
export const putJson  = (p, b, o) => request('PUT', p, b, o);
export const delJson  = (p, o)   => request('DELETE', p, null, o);
