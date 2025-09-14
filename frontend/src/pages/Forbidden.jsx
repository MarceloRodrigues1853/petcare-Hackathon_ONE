import React from 'react';
import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="forbidden-center">
      <div className="forbidden-card">
        <h1 className="forbidden-code">403</h1>
        <h2 className="forbidden-title">Acesso negado</h2>
        <p className="forbidden-text">
          Você não tem permissão para acessar esta página.
        </p>
        <div className="forbidden-action">
          <Link to="/" className="forbidden-btn">
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
}