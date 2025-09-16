// frontend/src/api/appointment.api.js
import { get, post, del } from './http.js';

export function listAppointments(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return get(`/agendamentos${qs ? `?${qs}` : ''}`);
}

export function createAppointment(payload) {
  // { ownerId, sitterId, petId, sitterServicoPrecoId, dataInicio, dataFim }
  return post('/agendamentos', payload);
}

export function deleteAppointment(id) {
  return del(`/agendamentos/${id}`);
}
