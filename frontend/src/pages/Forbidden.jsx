import React from 'react';
import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="center">
      <div className="card">
        <h1>403</h1>
        <h2 style={{ marginTop: 0 }}>Acesso negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
        <div style={{ marginTop: 12 }}>
          <Link to="/" className="btn">Voltar para a Home</Link>
        </div>
      </div>
    </div>
  );
}
