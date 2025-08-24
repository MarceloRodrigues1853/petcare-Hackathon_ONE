import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";

export default function Header() {
  return (
    <div className="header-wrap">
      <header className="header">
        <Link to="/" className="brand" aria-label="Ir para a Home">
          <Logo />
        </Link>

        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Cadastro</NavLink>
          <NavLink to="/about">Sobre</NavLink>
          <NavLink to="/services">Serviços</NavLink>
        </nav>
      </header>
    </div>
  );
}
