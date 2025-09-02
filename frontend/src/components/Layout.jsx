import { Outlet, Link } from "react-router-dom";
import "./Layout.css";
import Logo from "./Logo"; // importa a logo
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        {/* Logo no canto esquerdo */}
        <Link to="/" className="brand">
          <Logo />
        </Link>

        {/* Menu no canto direito */}
        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/about">Sobre</Link>
          <Link to="/services">Serviços</Link>
          <Link to="/login">Entre ou cadastre-se</Link>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
        <Footer />
        {/* © {new Date().getFullYear()} PetCare */}
      </footer>
    </div>
  );
}