export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <h4>Links rápidos</h4>
          <ul>
            <li><a href="/about">Sobre</a></li>
            <li><a href="/services">Serviços</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Cadastro</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contato</h4>
          <p>Email: contato@petcare.com</p>
          <p>Tel: (11) 99999-9999</p>
        </div>

        <div className="footer-section">
          <h4>Siga-nos</h4>
          <div className="social-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {new Date().getFullYear()} PetCare. Todos os direitos reservados.</small>
      </div>
    </footer>
  );
}