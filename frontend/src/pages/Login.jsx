import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/portfolio');
    } catch (err) {
      alert('Falha no login');
    }
  };

  return (
    <div className="auth-bg">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2 className="auth-title">Login</h2>
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
        <button type="submit" className="auth-btn">Entrar</button>
        <div className="auth-footer">
          Não tem conta?{' '}
          <a href="/register" className="auth-link">Cadastre-se</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
