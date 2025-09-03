// src/api/http.js

// 1. CORRETO: Lê a variável de ambiente VITE_API_BASE que agora 
//    contém a URL completa, como "http://localhost:8080/api".
const API = import.meta.env.VITE_API_BASE; 

function authHeader() {
  const t = localStorage.getItem('jwt');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(method, path, body, opts = {}) {
  // 2. CORRETO: Monta a URL final corretamente.
  //    Exemplo: "http://localhost:8080/api" + "/auth/login"
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

// 3. CORRETO: As funções de exportação continuam funcionando perfeitamente.
export const getJson  = (p, o) => request('GET', p, null, o);
export const postJson = (p, b, o) => request('POST', p, b, o);
export const putJson  = (p, b, o) => request('PUT', p, b, o);
export const delJson  = (p, o) => request('DELETE', p, null, o);