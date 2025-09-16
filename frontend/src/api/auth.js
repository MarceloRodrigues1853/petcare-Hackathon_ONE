import http from "./http";

// Registro
export async function register(data) {
  return http.post("/api/auth/register", data);
}

// Login
export async function login(data) {
  return http.post("/api/auth/login", data);
}

// Dados do usuário autenticado
export async function getMe() {
  return http.get("/api/auth/me"); //precisa existir no backend
}