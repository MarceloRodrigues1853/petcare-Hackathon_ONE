// src/api/sitter.js
import http from "./http";

/**
 * Perfil do Sitter
 * GET /api/sitters/me/profile -> { id, name, email }
 * PUT /api/sitters/me/profile -> { id, name, email }
 */
export async function getSitterProfile() {
  const { data } = await http.get("/api/sitters/me/profile");
  return data;
}

export async function updateSitterProfile(payload) {
  const { data } = await http.put("/api/sitters/me/profile", payload);
  return data;
}

/**
 * Dashboard do Sitter
 * GET /api/sitters/me/dashboard -> { totalAgendamentos, receitaDoMes, suaAvaliacao }
 */
export async function getSitterDashboard() {
  const { data } = await http.get("/api/sitters/me/dashboard");
  return data;
}

/**
 * Agendamentos do Sitter
 * GET /api/sitters/me/appointments?status=CONFIRMADO&future=true&limit=5
 */
export async function getSitterAppointments({ status, future, limit } = {}) {
  const params = {};
  if (status) params.status = status;
  if (future !== undefined) params.future = future;
  if (limit) params.limit = limit;
  const { data } = await http.get("/api/sitters/me/appointments", { params });
  return data;
}
