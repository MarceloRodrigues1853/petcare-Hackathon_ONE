// api/appointment.api.js
import { get, post, put, del } from './http.js';

/**
 * Lista agendamentos. A API deve filtrar pelo usuário logado.
 * Endpoint: GET /agendamentos
 */
export function listAppointments() {
  return get('/agendamentos');
}

/**
 * Busca um agendamento específico pelo ID.
 * Endpoint: GET /agendamentos/{id}
 */
export function getAppointmentById(id) {
  return get(`/agendamentos/${id}`);
}

/**
 * Cria um novo agendamento.
 * Endpoint: POST /agendamentos
 */
export function createAppointment(appointmentData) {
  return post('/agendamentos', appointmentData);
}

/**
 * Atualiza um agendamento.
 * Endpoint: PUT /agendamentos/{id}
 */
export function updateAppointment(id, appointmentData) {
  return put(`/agendamentos/${id}`, appointmentData);
}

/**
 * Deleta (cancela) um agendamento.
 * Endpoint: DELETE /agendamentos/{id}
 */
export function deleteAppointment(id) {
  return del(`/agendamentos/${id}`);
}