// src/pages/Portfolio.jsx
import { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/portfolio.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const GITHUB_USERNAME = 'LLetzel';
const MAIN_REPO = githubUser => `${githubUser}/${githubUser}`;
const PINNED = ['repo1', 'repo2']; 

const pieOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#a5b4fc',
        font: { size: 15, weight: 'bold', family: 'Inter, sans-serif' },
        padding: 20,
        boxWidth: 22,
        boxHeight: 22,
        borderRadius: 8,
      }
    },
    tooltip: {
      backgroundColor: '#23232b',
      titleColor: '#60a5fa',
      bodyColor: '#fff',
      borderColor: '#2563eb',
      borderWidth: 1.5,
      padding: 12,
      caretSize: 8,
      cornerRadius: 8,
      displayColors: true,
    }
  }
};

const Portfolio = () => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);
  const [search, setSearch] = useState('');
  const [githubUser, setGithubUser] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    if (!githubUser || showModal) return;
    const fetchGitHubData = async () => {
      setError('');
      setProfile(null);
      setRepos([]);
      setCommits([]);
      try {
        // Fetch profile
        const profileRes = await fetch(`https://api.github.com/users/${githubUser}`);
        if (!profileRes.ok) throw new Error('Usuário não encontrado');
        const profileData = await profileRes.json();
        setProfile(profileData);

        // Fetch repos
        const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`);
        if (!reposRes.ok) throw new Error('Erro ao buscar repositórios');
        const reposData = await reposRes.json();
        setRepos(Array.isArray(reposData) ? reposData : []);

        // Fetch commits (pega o primeiro repositório público do usuário)
        let commitsData = [];
        if (reposData && reposData.length > 0) {
          const mainRepo = reposData[0].name;
          const commitsRes = await fetch(`https://api.github.com/repos/${githubUser}/${mainRepo}/commits?per_page=5`);
          if (commitsRes.ok) {
            commitsData = await commitsRes.json();
          }
        }
        setCommits(Array.isArray(commitsData) ? commitsData : []);
      } catch (err) {
        setError(err.message || 'Erro ao buscar dados do GitHub');
      }
    };
    fetchGitHubData();
  }, [githubUser, showModal]);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedRepos = repos.filter(r => PINNED.includes(r.name));

  const languageStats = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});
  const totalLangs = Object.values(languageStats).reduce((a, b) => a + b, 0);

  const pieData = {
    labels: Object.keys(languageStats),
    datasets: [
      {
        data: Object.values(languageStats),
        backgroundColor: ['#2563eb', '#60a5fa', '#6366f1', '#14b8a6', '#f59e0b', '#ec4899'],
        hoverOffset: 4,
      }
    ]
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Header onLogout={logout} />

        <div className="portfolio-container">
          {showModal && (
            <div className="modal-overlay" style={{
              position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(24,24,27,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'
            }}>
              <div className="modal-content" style={{
                background:'rgba(35,35,43,0.97)', borderRadius:'1.2rem', boxShadow:'0 8px 40px #2563eb30', padding:'2.5rem 2rem', minWidth:320, maxWidth:'90vw', display:'flex', flexDirection:'column', alignItems:'center'
              }}>
                <h2 style={{color:'#60a5fa', fontWeight:700, fontSize:'1.3rem', marginBottom:'1.2rem'}}>Informe seu usuário do GitHub</h2>
                <input
                  type="text"
                  placeholder="Seu username do GitHub"
                  value={githubUser}
                  onChange={e => setGithubUser(e.target.value)}
                  style={{
                    padding:'0.7rem 1rem', borderRadius:'0.7rem', border:'1.5px solid #27272a', background:'rgba(24,24,27,0.85)', color:'#f4f4f5', fontSize:'1rem', marginBottom:'1.2rem', width:'100%', maxWidth:300
                  }}
                  autoFocus
                />
                <button
                  style={{
                    background:'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                    color:'#fff', fontWeight:600, padding:'0.75rem 1.5rem', border:'none', borderRadius:'0.7rem', fontSize:'1.1rem', boxShadow:'0 2px 8px #2563eb40', transition:'background 0.2s, transform 0.15s'
                  }}
                  onClick={() => githubUser.trim() && setShowModal(false)}
                >
                  Buscar Insights
                </button>
                {error && <div style={{color:'#ef4444', marginTop:'1rem', fontWeight:600}}>{error}</div>}
              </div>
            </div>
          )}

          {error && !showModal && (
            <div style={{color:'#ef4444', margin:'2rem auto', fontWeight:600, textAlign:'center'}}>{error}</div>
          )}

          {profile && (
            <div className="profile-section">
              <img src={profile.avatar_url} alt="avatar" className="avatar" />
              <div>
                <h1 className="profile-name">{profile.name || profile.login}</h1>
                <p className="profile-bio">{profile.bio}</p>
                <p className="profile-followers">👥 {profile.followers} seguidores</p>
                <a href={profile.html_url} target="_blank" rel="noreferrer" className="btn-profile">Ver Perfil no GitHub</a>
              </div>
            </div>
          )}

          <div className="chart-section">
            <h2 className="section-title">📊 Linguagens mais usadas</h2>
            <Pie data={pieData} options={pieOptions} />
          </div>

          {pinnedRepos.length > 0 && (
            <div className="pinned-section">
              <h2 className="section-title">📌 Repositórios Fixados</h2>
              <div className="repos-list">
                {pinnedRepos.map(repo => (
                  <div key={repo.id} className="repo-card">
                    <h3 className="repo-title">{repo.name}</h3>
                    <p className="repo-desc">{repo.description || 'Sem descrição'}</p>
                    <div className="repo-meta">
                      ⭐ {repo.stargazers_count} • 🍴 {repo.forks_count} • 🔧 {repo.language}
                    </div>
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-link">Ver no GitHub</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="section-title">Últimos Commits</h2>
          <ul className="commit-list">
            {commits.map(commit => (
              <li key={commit.sha} className="commit-item">
                <p>{commit.commit.message}</p>
                <small>{new Date(commit.commit.committer.date).toLocaleString()} – {commit.commit.author.name}</small>
              </li>
            ))}
          </ul>

          <div className="search-filter">
            <input
              type="text"
              placeholder="🔍 Buscar repositório…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <h2 className="section-title">Repositórios</h2>
          <div className="repos-list">
            {filteredRepos.map(repo => (
              <div key={repo.id} className="repo-card">
                <h3 className="repo-title">{repo.name}</h3>
                <p className="repo-desc">{repo.description || 'Sem descrição'}</p>
                <div className="repo-meta">
                  ⭐ {repo.stargazers_count} • 🍴 {repo.forks_count} • 🔧 {repo.language}
                </div>
                <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-link">Ver no GitHub</a>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Portfolio;
