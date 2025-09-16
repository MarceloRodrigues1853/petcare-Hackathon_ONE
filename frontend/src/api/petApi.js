import http from "./http";

// Lista todos os pets
export async function listarPets() {
  return http.get("/pets"); // backend precisa implementar GET /pets
}

// Busca um pet pelo ID
export async function buscarPet(id) {
  return http.get(`/pets/${id}`);
}

// Cria novo pet
export async function criarPet(pet) {
  return http.post("/pets", pet);
}

// Atualiza pet
export async function atualizarPet(id, pet) {
  return http.put(`/pets/${id}`, pet);
}

// Deleta pet
export async function deletarPet(id) {
  return http.del(`/pets/${id}`);
}