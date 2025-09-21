// src/api/admin.js
import http from "./http";

export async function getAdminStats() {
  const { data } = await http.get("/api/admin/dashboard");
  return data;
}

export async function listSitters({ status } = {}) {
  const params = {};
  if (status) params.status = status;
  const { data } = await http.get("/api/admin/sitters", { params });
  return data;
}

export async function listOwners() {
  const { data } = await http.get("/api/admin/owners");
  return data;
}

export async function updateSitterStatus(sitterId, newStatus) {
  await http.patch(`/api/admin/sitters/${sitterId}/status`, { status: newStatus });
}
