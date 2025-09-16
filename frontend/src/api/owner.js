import { get, post, put, del } from './http.js';

// ===================== PETS =====================
export async function getPets() {
  return get('/owner/pets');
}

export async function savePet(pet) {
  if (pet.id) {
    return put(`/owner/pets/${pet.id}`, pet); // atualiza pet existente
  } else {
    return post('/owner/pets', pet); // cria novo pet
  }
}

export async function removePet(petId) {
  return del(`/owner/pets/${petId}`);
}

// ===================== PROFILE =====================
export async function getProfile() {
  return get('/owner/profile');
}

export async function updateProfile(profileData) {
  return put('/owner/profile', profileData);
}

// ===================== APPOINTMENTS =====================
export async function getAppointments() {
  return get('/owner/appointments');
}

export async function createAppointment(appointmentData) {
  return post('/owner/appointments', appointmentData);
}

export async function updateAppointment(id, appointmentData) {
  return put(`/owner/appointments/${id}`, appointmentData);
}

export async function removeAppointment(id) {
  return del(`/owner/appointments/${id}`);
}

// ===================== STATS =====================
export async function getStats() {
  return get('/owner/stats');
}
