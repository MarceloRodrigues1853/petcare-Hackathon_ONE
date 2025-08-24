import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postJson } from "../services/api";

export default function Login(){
  // const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState("");

  async function handleSubmit(e){
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try{
      // Quando existir /auth/login no backend, descomente:
      // const data = await postJson("/auth/login", { email, password });
      // localStorage.setItem("token", data.token);
      // navigate("/dashboard");

      // Enquanto não existe:
      await new Promise(r=>setTimeout(r, 500));
      setMsg("Login: aguardando /auth/login no backend. (form ok)");
    }catch(err){
      setMsg(err.message || "Erro ao entrar");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="center">
      <h1>Login</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/>

          <label>Senha</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" required/>

          <button className="btn" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {msg && <p className="msg">{msg}</p>}

        <p className="footer-link">
          Ainda não possui uma conta?{" "}
          <Link to="/register" className="link">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}