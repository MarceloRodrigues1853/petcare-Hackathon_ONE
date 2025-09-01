import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJson } from '../utils/api'; // seu helper de fetch

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await postJson('/auth/login', { email, password });

      // salva no storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // redireciona baseado no perfil
      if (data.role === 'OWNER') {
        navigate('/owner/dashboard');
      } else if (data.role === 'SITTER') {
        navigate('/sitter/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Credenciais inválidas!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="E-mail"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
