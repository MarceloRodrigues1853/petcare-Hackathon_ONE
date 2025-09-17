import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
// REMOVEMOS o import do 'handleRedirectByRole'

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
      const userData = await login(email, password);
      
      // =======================================================
      // LÓGICA DE REDIRECIONAMENTO DIRETA - INÍCIO DA CORREÇÃO
      // =======================================================
      if (userData && userData.role) {
        const role = userData.role.toUpperCase();
        if (role === "OWNER") {
            navigate("/owner/dashboard", { replace: true });
        } else if (role === "SITTER") {
            navigate("/sitter/dashboard", { replace: true });
        } else if (role === "ADMIN") {
            navigate("/admin/dashboard", { replace: true });
        } else {
            navigate("/", { replace: true }); // Fallback
        }
      } else {
        // Se, por algum motivo, não recebermos os dados do usuário, vamos para a home.
        navigate("/", { replace: true });
      }
      // =======================================================
      // FIM DA CORREÇÃO
      // =======================================================

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