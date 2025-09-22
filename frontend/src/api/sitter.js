// src/api/sitter.js
import http from "./http";

/** Perfil */
export async function getSitterProfile() {
  return await http.get("/sitters/me/profile");
}
export async function updateSitterProfile(payload) {
  return await http.put("/sitters/me/profile", payload);
}

/** Dashboard → normaliza pt/en */
export async function getSitterStats() {
  const d = await http.get("/sitters/me/dashboard");
  return {
    totalAppointments: d.totalAppointments ?? d.totalAgendamentos ?? 0,
    monthlyRevenue: d.monthlyRevenue ?? d.receitaDoMes ?? 0,
    rating: d.rating ?? d.suaAvaliacao ?? 0,
  };
}

/** Próximos agendamentos (normaliza campos) */
export async function getUpcomingAppointments(limit = 5, status) {
  const params = { future: true, limit };
  if (status) params.status = status;
  const list = await http.get("/sitters/me/appointments", { params });
  return (list ?? []).map((a) => ({
    id: a.id,
    clientName: a.clientName,
    petName: a.petName,
    serviceName: a.service ?? a.serviceName ?? null,
    startAt: a.dataInicio ?? a.startDate ?? null,
  }));
}

/** ===== Serviços do Sitter ===== */

/** mapeia descrição → chave do form */
function keyFromDescricao(desc = "") {
  const d = String(desc).toLowerCase();
  if (d.includes("passeio")) return "walking";
  if (d.includes("bab")) return "sitting";     // babá/baba
  if (d.includes("hosp")) return "hosting";    // hospedagem
  return null;
}
function descricaoFromKey(key) {
  if (key === "walking") return "Passeio";
  if (key === "sitting") return "Babá";
  if (key === "hosting") return "Hospedagem";
  return key;
}

/** GET meus serviços (via /me/profile → id → /sitters/{id}/services) */
export async function getMyServices() {
  const me = await getSitterProfile(); // { id, name, email }
  const arr = await http.get(`/sitters/${me.id}/services`); // [{id, servico, valor}]
  const base = {
    walking: { active: false, price: 0 },
    sitting: { active: false, price: 0 },
    hosting: { active: false, price: 0 },
  };
  for (const row of arr ?? []) {
    const k = keyFromDescricao(row.servico ?? "");
    if (!k) continue;
    base[k] = { active: true, price: Number(row.valor ?? 0) };
  }
  return base;
}

/**
 * Tenta salvar serviços.
 * ⚠️ Swagger NÃO expõe PUT/POST p/ /sitters/{id}/services — vamos tentar PUT
 * e, se não existir, mostramos erro amigável no UI.
 */
export async function saveMyServices(formState) {
  const me = await getSitterProfile();
  const out = [];
  for (const [k, v] of Object.entries(formState ?? {})) {
    if (v?.active) out.push({ servico: descricaoFromKey(k), valor: Number(v.price || 0) });
  }
  try {
    // ajuste aqui se criarem o endpoint correto no backend
    return await http.put(`/sitters/${me.id}/services`, out);
  } catch (e) {
    // se o backend não tiver esse endpoint ainda:
    if (e?.response?.status === 404 || e?.response?.status === 405) {
      throw new Error("Salvar serviços ainda não está disponível no backend.");
    }
    throw e;
  }
}
