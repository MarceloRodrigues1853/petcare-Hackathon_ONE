const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api';

export async function postJson(path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = localStorage.getItem('token');
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getJson(path, auth = false) {
  const headers = {};
  if (auth) {
    const t = localStorage.getItem('token');
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { headers, credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
