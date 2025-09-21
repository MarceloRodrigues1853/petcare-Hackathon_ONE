// src/api/auth.js
import http from "./http";

/**
 * Login -> /api/auth/login
 * Body: { email, password }
 * Resposta esperada: { token, user: { id, name, email, role, status } }
 */
export async function login(email, password) {
  const { data } = await http.post("/api/auth/login", { email, password });
  if (data?.token) localStorage.setItem("authToken", data.token);
  if (data?.user) localStorage.setItem("me", JSON.stringify(data.user));
  return data;
}

/**
 * Registro -> /api/auth/register
 * Body: { name, email, password, role } (role: OWNER|SITTER)
 */
export async function register(payload) {
  const { data } = await http.post("/api/auth/register", payload);
  return data;
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("me");
}

export function getMeFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("me") || "null");
  } catch {
    return null;
  }
}
