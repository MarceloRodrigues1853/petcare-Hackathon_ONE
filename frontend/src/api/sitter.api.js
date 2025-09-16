// frontend/src/api/sitter.api.js
import { get, put, post, del } from './http.js'; // Verifique se o caminho para http.js está correto

// [NOVO] Função adicionada para listar todos os sitters (para o admin)
export function listSitters(params = {}) {
  const qs = new URLSearchParams(params).toString();
  // A rota no backend provavelmente será protegida e semelhante à de owners
  return get(`/admin/sitters${qs ? `?${qs}` : ''}`);
}

// No backend, você precisará de uma rota /api/sitters/{id} que retorna
// os dados de um usuário cujo papel (role) é SITTER.
export function getSitterById(id) {
  return get(`/sitters/${id}`);
}

// [NOVO] Função para buscar os serviços de um sitter específico.
// Essencial para a tela de novo agendamento.
export function getSitterServices(sitterId) {
  return get(`/sitters/${sitterId}/services`);
}

// [NOVO] Função para um sitter adicionar um novo serviço ao seu perfil.
export function addSitterService(payload) {
  // O backend receberá o ID do sitter pelo token de autenticação
  // O payload deve conter o ID do serviço e o preço. Ex: { servicoId, preco }
  return post('/sitters/services', payload);
}

// [NOVO] Função para um sitter remover um de seus serviços.
export function deleteSitterService(servicePriceId) {
  // O ID aqui é o da tabela 'sitter_servicos_precos'
  return del(`/sitters/services/${servicePriceId}`);
}

export function updateSitter(id, payload) {
  return put(`/sitters/${id}`, payload);
}

