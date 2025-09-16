// src/pages/Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { handleRedirectByRole } from "../utils/navigation"; // <- Importando nosso helper

export default function Register() {
  const navigate = useNavigate();
  // 1. Pegando a função 'register' do nosso contexto
  const { login, register } = useAuth(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("OWNER");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      // 2. Usando a função 'register' do contexto
      await register({
        name,
        email,
        password,
        role: role?.toUpperCase() || "OWNER",
      });

<<<<<<< HEAD
      // login automático (a lógica continua perfeita)
      const session = await login(email, password);
      
      // 3. Usando nosso helper para não repetir código
      handleRedirectByRole(session, navigate);

=======
      // login automático
      const session = await login(email, password);
      const r = (session?.role || session?.user?.role || "").toUpperCase();
      if (r === "OWNER") navigate("/owner/dashboard");
      else if (r === "SITTER") navigate("/sitter/dashboard");
      else if (r === "ADMIN") navigate("/admin/dashboard");
      else navigate("/");
>>>>>>> feature/admin-wip
    } catch (err) {
      setMsg(err?.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    // SEU JSX CONTINUA IGUAL, ELE JÁ ESTÁ PERFEITO
    <div className="center">
      <h1>Cadastro</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            required
          />

          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmar senha"
            required
          />

          <label>Tipo de usuário</label>
          <select
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
<<<<<<< HEAD
            <option value="OWNER">Dono de Pet</option>
=======
            <option value="OWNER">Dono</option>
>>>>>>> feature/admin-wip
            <option value="SITTER">Cuidador(a)</option>
          </select>

          <button className="btn" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {msg && <p className="msg">{msg}</p>}

        <p className="footer-link">
          Já possui uma conta? <Link to="/login" className="link">Login</Link>
        </p>
      </div>
    </div>
  );
}