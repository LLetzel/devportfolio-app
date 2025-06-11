import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/portfolio.css';

const GITHUB_USERNAME = 'LLetzel'; // ⬅️ Substitua pelo seu nome de usuário do GitHub

const Portfolio = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRepos = async () => {
    try {
      const res = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=9&sort=updated`);
      setRepos(res.data);
    } catch (err) {
      console.error('Erro ao buscar repositórios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Header />
        <div className="portfolio-container">
          <h1 className="portfolio-title">📂 Meus Repositórios no GitHub</h1>
          {loading ? (
            <p className="portfolio-loading">Carregando repositórios...</p>
          ) : repos.length === 0 ? (
            <p className="portfolio-empty">Nenhum repositório encontrado.</p>
          ) : (
            <div className="portfolio-grid">
              {repos.map(repo => (
                <div key={repo.id} className="portfolio-card">
                  <h2 className="repo-title">{repo.name}</h2>
                  <p className="repo-desc">{repo.description || 'Sem descrição'}</p>
                  <p className="repo-lang">Linguagem: <span>{repo.language || 'N/A'}</span></p>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-link">
                    🔗 Ver no GitHub
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;