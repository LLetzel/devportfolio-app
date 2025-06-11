const Header = ({ onLogout }) => {
  return (
    <header className="header">
      <h1 className="header-title">Painel de Projetos</h1>
      <button className="btn-primary" onClick={onLogout}>Sair</button>
    </header>
  );
};

export default Header;