// src/api/http.js
import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const API_BASE = rawBase.replace(/\/+$/, "");

const http = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (resp) => resp.data,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Tempo de requisição excedido. Tente novamente.";
    } else if (!error.response) {
      error.message = "Falha de rede ou servidor indisponível.";
    } else if (error.response.status === 401) {
      // opcional: logout/redirect global
      // localStorage.removeItem("jwt");
      // window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default http;

export async function getJson(url, config) {
  return await http.get(url, config);
}
export async function postJson(url, body, config) {
  return await http.post(url, body, config);
}
export async function putJson(url, body, config) {
  return await http.put(url, body, config);
}
export async function delJson(url, config) {
  return await http.delete(url, config);
}
