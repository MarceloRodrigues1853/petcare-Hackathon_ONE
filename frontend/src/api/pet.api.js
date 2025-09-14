// src/api/pet.api.js
import { get, post, put, del } from './http.js';

/**
 * Lista os pets. A API deve filtrar e retornar apenas os do owner logado.
 * Endpoint: GET /pets
 */
export function listPets() {
  return get('/pets');
}

/**
 * Busca um pet específico pelo ID.
 * Endpoint: GET /pets/{id}
 */
export function getPetById(petId) {
  return get(`/pets/${petId}`);
}

/**
 * Cria um novo pet.
 * Endpoint: POST /pets
 */
export function createPet(petData) {
  // A API espera: { nome, especie, idade, ownerId }
  return post('/pets', petData);
}

/**
 * Atualiza um pet existente.
 * Endpoint: PUT /pets/{id}
 */
export function updatePet(petId, petData) {
  // A API espera: { nome, especie, idade, ownerId }
  return put(`/pets/${petId}`, petData);
}

/**
 * Deleta um pet.
 * Endpoint: DELETE /pets/{id}
 */
export function deletePet(petId) {
  return del(`/pets/${petId}`);
}