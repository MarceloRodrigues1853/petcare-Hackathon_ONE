import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { postJson } from "../services/api"; // você já criou services/api.js

export default function Register(){
  const navigate = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [role,setRole] = useState("OWNER");
  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState("");

  async function handleSubmit(e){
    e.preventDefault();
    setMsg("");
    if(password !== confirm){
      setMsg("As senhas não conferem.");
      return;
    }
    setLoading(true);
    try{
      // por enquanto vamos cadastrar sempre como OWNER (como no seu backend)
      await postJson("/auth/register", { name, email, password, role: "OWNER" });
      setMsg("Cadastro criado com sucesso! Redirecionando para login…");
      setTimeout(()=> navigate("/login"), 700);
    }catch(err){
      setMsg(err.message || "Erro ao cadastrar");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="center">
      <Logo/>
      <h1>Cadastro</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" required/>

          <label>E-mail</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" required/>

          <label>Senha</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" required/>

          <label>Confirmar senha</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirmar senha" required/>

          <label>Tipo de usuário</label>
          <select 
            className="role-select" 
            value={role} 
            onChange={e=>setRole(e.target.value)}
            required
          >

            <option value="" disabled>Selecione</option>
            <option value="OWNER">Dono</option>
            <option value="SITTER">Cuidador(a)</option>
          </select>

          <button className="btn" disabled={loading}>
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