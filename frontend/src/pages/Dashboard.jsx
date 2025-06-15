import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const [userProjects, setUserProjects] = useState([]);
  const [communityProjects, setCommunityProjects] = useState([]);
  const [form, setForm] = useState({ titulo: '', description: '', link: '', imagem: null });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Busca todos os projetos e filtra os do usuário
  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://devportfolio-backend-production.up.railway.app/api/projetos');
      setCommunityProjects(res.data);
      setUserProjects(res.data.filter(p => p.usuario_id === user?.id));
    } catch (err) {
      setError('Erro ao carregar projetos.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: name === 'imagem' ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = new FormData();
    data.append('usuario_id', user?.id);
    Object.keys(form).forEach(key => form[key] && data.append(key, form[key]));

    try {
      if (editId) {
        await axios.put(`https://devportfolio-backend-production.up.railway.app/api/projetos/${editId}`, data);
      } else {
        await axios.post('https://devportfolio-backend-production.up.railway.app/api/projetos', data);
      }
      setForm({ titulo: '', description: '', link: '', imagem: null });
      setEditId(null);
      fetchProjects();
      setShowModal(false);
    } catch (err) {
      setError('Erro ao salvar projeto. Verifique os campos e tente novamente.');
    }
  };

  const handleEdit = (project) => {
    setForm({
      titulo: project.titulo,
      description: project.description,
      link: project.link,
      imagem: null
    });
    setEditId(project.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      await axios.delete(`https://devportfolio-backend-production.up.railway.app/api/projetos/${id}`);
      fetchProjects();
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Header title="Painel de Projetos" onLogout={logout} />

        <button
          className="btn-primary add-project-btn"
          onClick={() => {
            setEditId(null);
            setForm({ titulo: '', description: '', link: '', imagem: null });
            setShowModal(true);
          }}
        >
          + Adicionar Projeto
        </button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
              <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-title">{editId ? 'Editar Projeto' : 'Novo Projeto'}</h2>
                {error && <div className="form-error">{error}</div>}
                <input type="text" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
                <textarea name="description" placeholder="Descrição" value={form.description} onChange={handleChange} required />
                <input type="text" name="link" placeholder="Link do Projeto" value={form.link} onChange={handleChange} />
                <input type="file" name="imagem" onChange={handleChange} />
                <button type="submit" className="btn-primary">{editId ? 'Atualizar' : 'Criar Projeto'}</button>
              </form>
            </div>
          </div>
        )}

        {/* Seção dos projetos do usuário */}
        <section className="section-projects">
          <h2 className="section-title-user">Meus Projetos</h2>
          <div className="project-list">
            {userProjects.length === 0 && (
              <div className="empty-message">Você ainda não cadastrou projetos.</div>
            )}
            {userProjects.map(proj => (
              <div key={proj.id} className="project-card">
                {proj.imagem && (
                  <img
                    src={`http://localhost:3000${proj.imagem}`}
                    alt={proj.titulo}
                    className="project-image"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                  />
                )}
                <div className="project-info">
                  <h3 className="project-title">{proj.titulo}</h3>
                  <p className="project-desc">{proj.description}</p>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="project-link">Acessar</a>
                  )}
                </div>
                <div className="project-actions">
                  <button onClick={() => handleEdit(proj)} className="btn-secondary">Editar</button>
                  <button onClick={() => handleDelete(proj.id)} className="btn-danger">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção dos projetos da comunidade */}
        <section className="section-projects">
          <h2 className="section-title-community">Projetos da Comunidade</h2>
          <div className="project-list">
            {communityProjects.length === 0 && (
              <div className="empty-message">Nenhum projeto encontrado.</div>
            )}
            {communityProjects.map(proj => (
              <div key={proj.id} className="project-card community-card">
                {proj.imagem && (
                  <img
                    src={`http://localhost:3000${proj.imagem}`}
                    alt={proj.titulo}
                    className="project-image"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                  />
                )}
                <div className="project-info">
                  <h3 className="project-title">{proj.titulo}</h3>
                  <p className="project-desc">{proj.description}</p>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="project-link">Acessar</a>
                  )}
                </div>
                {/* Não mostra editar/excluir para projetos da comunidade */}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
