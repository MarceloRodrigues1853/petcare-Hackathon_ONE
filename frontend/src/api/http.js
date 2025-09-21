// src/api/http.js
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// anexa JWT quando existir
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// trata 401/403 de forma centralizada (opcional)
http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // opcional: fazer logout automático
      // localStorage.removeItem("authToken");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default http;
