import http from "./http";

// Buscar todos os serviços disponíveis
export async function listarServicos() {
  return http.get("/api/servicos");
}

// Buscar serviço por ID
export async function getServico(id) {
  return http.get(`/api/servicos/${id}`);
}

// Criar novo serviço (admin)
export async function criarServico(descricao) {
  return http.post("/api/servicos", { descricao });
}

// Atualizar serviço (admin)
export async function atualizarServico(id, descricao) {
  return http.put(`/api/servicos/${id}`, { descricao });
}

// Deletar serviço (admin)
export async function deletarServico(id) {
  return http.del(`/api/servicos/${id}`);
}