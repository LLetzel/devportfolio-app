import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/dashboard.css'

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ titulo: '', description: '', link: '', imagem: null });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/projetos');
      setProjects(res.data);
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
    // Inclua o usuario_id
    data.append('usuario_id', user?.id);
    Object.keys(form).forEach(key => form[key] && data.append(key, form[key]));

    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/projetos/${editId}`, data);
      } else {
        await axios.post('http://localhost:3000/api/projetos', data);
      }
      setForm({ titulo: '', description: '', link: '', imagem: null });
      setEditId(null);
      fetchProjects();
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
    if (confirm('Tem certeza que deseja excluir?')) {
      await axios.delete(`http://localhost:3000/api/projetos/${id}`);
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

        <div className="project-list">
          {projects.map(proj => (
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
      </div>
    </div>
  );
};

export default Dashboard;
