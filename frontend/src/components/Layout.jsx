import {  Outlet, Link } from "react-router-dom";
import "./Layout.css";
import logo from "../assets/images/logo.png";

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <h1 className="logo">
          <Link to="/">PetCare</Link>
        </h1>
        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/about">Sobre</Link>
          <Link to="/services">Serviços</Link>
          <Link to="/login">Entre ou cadastre-se</Link>
        </nav>
      </header>

      {/* Aqui vai renderizar a página atual */}
      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} PetCare
      </footer>
    </div>
  );
}
