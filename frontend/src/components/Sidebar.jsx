import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { parseJwt } from '../utils/jwt';
import axios from 'axios';

const Sidebar = () => {
  const { token, user } = useContext(AuthContext);
  const [avatar, setAvatar] = useState('');
  let nome = user?.username;
  if (token) {
    const payload = parseJwt(token);
    nome = payload?.username;
  }

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvatar(res.data.avatar ? `http://localhost:3000${res.data.avatar}` : 'src/assets/perfil-padrao.jpg');
      } catch {
        setAvatar('src/assets/perfil-padrao.jpg');
      }
    };
    fetchAvatar();
  }, [token]);

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          <img
            src={avatar || 'src/assets/perfil-padrao.jpg'}
            alt="Avatar"
            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <div className="sidebar-hello">Olá,</div>
          <div className="sidebar-username">{nome}</div>
        </div>
      </div>
      <h2 className="sidebar-title">DevPortfolio</h2>
      <nav>
        <Link to="/" className="sidebar-link">Painel</Link>
        <Link to="/portfolio" className="sidebar-link">Portfólio</Link>
        <Link to="/profile" className="sidebar-link">Perfil</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;