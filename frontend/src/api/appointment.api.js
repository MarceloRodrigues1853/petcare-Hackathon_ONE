// frontend/src/api/appointment.api.js
import { get, post, del } from './http.js';

/** Lista agendamentos do usuário autenticado (Owner -> seus; Sitter -> seus) */
export function listAppointments(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return get(`/agendamentos${qs ? `?${qs}` : ''}`);
}

/** Cria um agendamento
 * payload: { ownerId, sitterId, petId, sitterServicoPrecoId, dataInicio, dataFim, status? }
 */
export function createAppointment(payload) {
  return post('/agendamentos', payload);
}

/** Remove um agendamento pelo id */
export function deleteAppointment(id) {
  return del(`/agendamentos/${id}`);
}
