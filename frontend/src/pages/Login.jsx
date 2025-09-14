// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { handleRedirectByRole } from "../utils/navigation"; // <- Importando nosso helper

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const session = await login(email, password);
      // Usando o helper!
      handleRedirectByRole(session, navigate); 
    } catch (err) {
      setMsg(err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center">
      <h1>Login</h1>
      <div className="card form-card">
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />

          <div className="form-footer">
            <a href="/entrar/esqueci-senha" className="link">
              Esqueci minha senha
            </a>
          </div>

          <button className="btn" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {msg && <p className="msg">{msg}</p>}

        <p className="footer-link">
          Ainda não possui uma conta?{" "}
          <Link to="/register" className="link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}