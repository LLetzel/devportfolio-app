import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Register = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://devportfolio-backend-production.up.railway.app/api/auth/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      alert('Erro ao registrar');
    }
  };

  return (
    <div className="auth-bg">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2 className="auth-title">Cadastro</h2>
        <input
          type="text"
          placeholder="Nome"
          value={username}
          onChange={e => setName(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-btn">Cadastrar</button>
        <div className="auth-footer">
          Já tem conta?{' '}
          <a href="/login" className="auth-link">Entrar</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
