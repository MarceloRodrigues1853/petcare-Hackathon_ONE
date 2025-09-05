import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { User, LogOut } from "lucide-react";

// Para contornar os erros de importação, os componentes e estilos foram incluídos diretamente aqui.

// Componente Logo (baseado no seu código)
const Logo = () => (
  <img 
    src="../assets/images/logo.png" // Garanta que o seu ficheiro logo.png está na pasta `public`
    alt="PetCare Logo" 
    style={{ height: '40px', width: 'auto' }} 
  />
);

// Componente Footer (baseado no seu código)
const Footer = () => (
  <div className="footer-content">
    <div className="footer-section">
      <h4>Links rápidos</h4>
      <ul>
        <li><Link to="/about">Sobre</Link></li>
        <li><Link to="/services">Serviços</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
    <div className="footer-section">
      <h4>Contacto</h4>
      <p>Email: contato@petcare.com</p>
      <p>Tel: (11) 99999-9999</p>
    </div>
    <div className="footer-section social-links">
      <h4>Siga-nos</h4>
      <a href="#">Instagram</a>
      <a href="#">Facebook</a>
    </div>
  </div>
);

// Estilos do seu ficheiro Layout.css
const LayoutStyles = () => (
  <style>{`
    .layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .content {
      flex: 1;
    }
    .header {
      max-width: 100%;
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 40px;
      background-color: #ffffff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav {
      display: flex;
      gap: 25px;
      align-items: center;
    }
    .nav a, .nav div {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      font-size: 20px;
      transition: color 0.3s ease;
    }
    .nav a:hover {
      color: #0077ff;
    }
    .footer {
      background: #0E355C;
      color: #fff;
      padding: 2rem 1rem;
      margin-top: 3rem;
      text-align: center;
      font-size: 0.95rem;
    }
    .footer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      text-align: left;
    }
    .footer-section h4 {
      margin-bottom: 0.8rem;
    }
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    .footer-section a {
      text-decoration: none;
      color: #fff;
    }
  `}</style>
);


export default function Layout() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <LayoutStyles />
      <div className="layout">
        <header className="header">
          <Link to="/" className="brand">
            <Logo />
          </Link>
          <nav className="nav">
            <Link to="/">Início</Link>
            <Link to="/about">Sobre</Link>
            <Link to="/services">Serviços</Link>
            
            {user ? (
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <User size={18} />
                  <span>Olá, {user.name}!</span>
                </div>
                
                {isDropdownOpen && (
                  <div 
                    style={{ position: 'absolute', right: 0, marginTop: '0.5rem', width: '12rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', zIndex: 50 }}
                  >
                     <Link to={ user.role === 'SITTER' ? '/sitter/dashboard' : '/owner/dashboard' } 
                          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151', width: '100%', textAlign: 'left' }}
                      >
                      Meu Painel
                    </Link>
                    <button 
                      onClick={logout}
                      title="Sair"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">Entre ou cadastre-se</Link>
            )}
          </nav>
        </header>
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      </div>
    </>
  );
}

