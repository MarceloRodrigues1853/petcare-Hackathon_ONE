import { useState, useRef, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
// CORREÇÃO: Adicionando a extensão .jsx para garantir a resolução dos ficheiros.
import { useAuth } from "../context/AuthContext.jsx";
import "./Layout.css";
import Logo from "./Logo.jsx";
import Footer from "./Footer.jsx";
import { User, LogOut } from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lógica para fechar o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // --- NOVA FUNÇÃO AUXILIAR ---
  // Esta função determina o link correto do painel com base na role do usuário.
  // É mais limpa e escalável do que múltiplos ternários.
  const getDashboardPath = (role) => {
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'SITTER':
        return '/sitter/dashboard';
      case 'OWNER':
        return '/owner/dashboard';
      default:
        // Um fallback seguro, caso a role não seja reconhecida
        return '/';
    }
  };

  return (
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
            <div className="relative" ref={dropdownRef}>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(prev => !prev)}
              >
                <User size={18} />
                <span>Olá, {user.name}!</span>
              </div>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                   {/* --- CORREÇÃO APLICADA AQUI --- */}
                   <Link 
                     to={getDashboardPath(user.role)} 
                     className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                     onClick={() => setIsDropdownOpen(false)}
                   >
                     Meu Painel
                   </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                    title="Sair"
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
  );
}

