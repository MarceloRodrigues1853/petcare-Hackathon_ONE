import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postJson } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
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
    if (!role) {
      setMsg("Selecione o tipo de usuário.");
      return;
    }

    setLoading(true);
    try {
      // 1) Cadastrar
      const registerResp = await postJson("/auth/register", {
        name,
        email,
        password,
        role,
      });
      // registerResp esperado: { message, email }
      // (Se seu backend retornar outro formato, me avisa que ajusto)

      // 2) Auto-login
      const loginResp = await postJson("/auth/login", { email, password });

      const token = loginResp.token;
      const tokenType = loginResp.tokenType || "Bearer";
      const userRole = loginResp.role || role; // fallback pro role escolhido
      const userEmail = loginResp.email || email;

      // 3) Guardar sessão
      localStorage.setItem("token", token);
      localStorage.setItem("tokenType", tokenType);
      localStorage.setItem("role", userRole);
      localStorage.setItem("email", userEmail);

      setMsg("Cadastro realizado! Entrando...");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      // 409 geralmente = e-mail já usado
      setMsg(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  const formInvalid =
    !name.trim() ||
    !email.trim() ||
    !password ||
    !confirm ||
    password !== confirm ||
    !role;

  return (
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
            autoComplete="new-password"
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmar senha"
            required
            autoComplete="new-password"
          />

          <label>Tipo de usuário</label>
          <select
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="OWNER">Dono</option>
            <option value="SITTER">Cuidador(a)</option>
          </select>

          <button className="btn" disabled={loading || formInvalid}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {msg && <p className="msg">{msg}</p>}

        <p className="footer-link">
          Já possui uma conta?{" "}
          <Link to="/login" className="link">Login</Link>
        </p>
      </div>
    </div>
  );
}
