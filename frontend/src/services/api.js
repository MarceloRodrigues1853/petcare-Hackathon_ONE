const API = import.meta.env.VITE_API_BASE || '/api';

export async function postJson(path, body, withAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include', // ok com allowCredentials(true)
  });

  if (!res.ok) {
    // tenta pegar mensagem do backend
    let msg = `Erro ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
      if (data?.error) msg = data.error;
    } catch (_) {}
    throw new Error(msg);
  }
  // 204?
  if (res.status === 204) return null;
  return res.json();
}

export async function getJson(path, withAuth = true) {
  const headers = {};
  if (withAuth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API}${path}`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}
