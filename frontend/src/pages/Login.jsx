// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      const r = (session?.role || "").toUpperCase();
      if (r === "OWNER") navigate("/owner/dashboard");
      else if (r === "SITTER") navigate("/sitter/dashboard");
      else if (r === "ADMIN") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      setMsg(err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <h1>Login</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
          <label>Senha</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" required />
          <a href="/entrar/esqueci-senha" className="link right">Esqueci minha senha</a>
          <button className="btn" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        </form>
        {msg && <p className="msg">{msg}</p>}
        <p className="footer-link">
          Ainda não possui uma conta? <Link to="/register" className="link">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
