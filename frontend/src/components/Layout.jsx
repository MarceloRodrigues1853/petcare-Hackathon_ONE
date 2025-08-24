import { Outlet, Link } from "react-router-dom";
import "./Layout.css";
import logo from "../assets/images/logo.png";

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/about">Sobre</Link>
          <Link to="/services">Serviços</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Registrar</Link>
        </nav>
      </header>

      {/* Aqui vai renderizar a página atual */}
      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2025 PetCare. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
