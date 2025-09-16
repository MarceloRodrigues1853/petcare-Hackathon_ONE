// frontend/src/api/pet.api.js
import { get, post, del } from './http.js';

export function listPets(ownerId) {
  const qs = ownerId ? `?ownerId=${ownerId}` : '';
  return get(`/pets${qs}`);
}

export function createPet(payload) {
  // { nome, especie, idade, ownerId }
  return post('/pets', payload);
}

export function deletePet(id) {
  return del(`/pets/${id}`);
}
