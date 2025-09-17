import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, login } = useAuth(); // Pegamos a função 'register' do contexto
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
      // 1. Chama a função de registo do contexto
      await register({
        name,
        email,
        password,
        role,
      });

      // 2. A lógica de login/redirect já está dentro do register/login do AuthContext.
      //    O fluxo de navegação será tratado pelos nossos componentes de rota.
      //    O ideal é que o PublicRoute nos redirecione automaticamente.
      //    Mas para garantir, podemos fazer um redirect manual.
      const loggedInUser = useAuth().user; // Pega o usuário que foi setado pelo login automático
      const userRole = (loggedInUser?.role || "").toUpperCase();

      if (userRole === "OWNER") navigate("/owner/dashboard", { replace: true });
      else if (userRole === "SITTER") navigate("/sitter/dashboard", { replace: true });
      else if (userRole === "ADMIN") navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });

    } catch (err) {
      setMsg(err?.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

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
            <option value="OWNER">Dono de Pet</option>
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