import http from "./http";

/** DASHBOARD DO OWNER */
export async function getOwnerDashboard() {
  return await http.get("/owners/me/painel");
}

/** APPOINTMENTS DO OWNER */
export async function getOwnerAppointments(status) {
  const params = {};
  if (status) params.status = status;
  return await http.get("/owners/me/compromissos", { params });
}

/** CRIAR APPOINTMENT */
export async function createOwnerAppointment(payload) {
  return await http.post("/owners/me/compromissos", payload);
}

/** PERFIL DO OWNER */
export async function getOwnerProfile() {
  return await http.get("/owners/me/profile");
}
export async function updateOwnerProfile({ name, phone, bio }) {
  return await http.put("/owners/me/profile", { name, phone, bio });
}

/** PETS (do owner) */
export async function getPets() {
  const data = await http.get("/pets");
  // ⚠️ Checar backend: é `name` ou `nome`?
  return (data || []).map((p) => ({
    id: p.id,
    name: p.name ?? p.nome,
    species: p.especie ?? p.species,
    age: p.idade ?? p.age,
    ownerId: p.ownerId ?? null,
  }));
}
export const listPets = getPets;

export async function savePet({ name, species, age, ownerId }) {
  // ⚠️ Se o backend agora usa `name`, envie `name`; se ainda for `nome`, mantenha:
  const body = { name, especie: species, idade: Number(age), ownerId: ownerId ?? null };
  const data = await http.post("/pets", body);
  return {
    id: data.id,
    name: data.name ?? data.nome,
    species: data.especie ?? data.species,
    age: data.idade ?? data.age,
    ownerId: data.ownerId ?? null,
  };
}

export async function removePet(id) {
  await http.delete(`/pets/${id}`);
  return { ok: true, message: "Pet removido com sucesso." };
}

/** SITTERS E SERVIÇOS */
export async function listSitters(status = "ACTIVE") {
  return await http.get(`/sitters`, { params: { status } });
}
export async function listSitterServices(sitterId) {
  return await http.get(`/sitters/${sitterId}/services`);
}
