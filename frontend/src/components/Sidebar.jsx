import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { parseJwt } from '../utils/jwt';

const Sidebar = () => {
  const { token, user } = useContext(AuthContext);
  let nome = user?.username;
  if (token) {
    const payload = parseJwt(token);
    nome = payload?.username
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">
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
      </nav>
    </aside>
  );
};

export default Sidebar;