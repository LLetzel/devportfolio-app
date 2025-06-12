import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';

const Profile = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setPreview(res.data.avatar ? `http://localhost:3000${res.data.avatar}` : '');
      } catch {
        setError('Erro ao carregar perfil.');
      }
    };
    fetchProfile();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : (profile?.avatar ? `http://localhost:3000${profile.avatar}` : ''));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!image) return setError('Selecione uma imagem.');
    const formData = new FormData();
    formData.append('avatar', image);
    try {
      const res = await axios.put('http://localhost:3000/api/user/me/avatar', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Avatar atualizado com sucesso!');
      setProfile({ ...profile, avatar: res.data.avatar });
      setPreview(`http://localhost:3000${res.data.avatar}`);
      setImage(null);
    } catch {
      setError('Erro ao atualizar avatar.');
    }
  };

  // Função para excluir a foto de perfil
  const handleDeleteAvatar = async () => {
    setSuccess('');
    setError('');
    try {
      await axios.delete('http://localhost:3000/api/user/me/avatar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({ ...profile, avatar: null });
      setPreview('');
      setSuccess('Avatar removido com sucesso!');
    } catch {
      setError('Erro ao remover avatar.');
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Header onLogout={logout} />
        <div className="profile-container">
          <h2 className="profile-title">Meu Perfil</h2>
          <div className="profile-card">
            <div className="profile-avatar-section">
              <img
                src={preview || 'src/assets/perfil-padrao.jpg'}
                alt="Avatar"
                className="profile-avatar"
              />
              <form onSubmit={handleUpload} className="profile-upload-form">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="profile-image"
                  style={{ display: 'none' }}
                />
                <label htmlFor="profile-image" className="profile-upload-btn">
                  Escolher Foto
                </label>
                <button type="submit" className="profile-save-btn">Salvar</button>
                <button
                  type="button"
                  className="profile-delete-btn"
                  style={{
                    background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    padding: '0.5rem 1.2rem',
                    border: 'none',
                    borderRadius: '0.7rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #ef444440',
                    transition: 'background 0.2s, transform 0.15s',
                    marginLeft: '0.5rem'
                  }}
                  onClick={handleDeleteAvatar}
                  disabled={!profile?.avatar}
                  title="Excluir foto de perfil"
                >
                  Excluir Foto
                </button>
              </form>
              {success && <div className="profile-success">{success}</div>}
              {error && <div className="profile-error">{error}</div>}
            </div>
            <div className="profile-info">
              <div><strong>Nome:</strong> {profile?.username}</div>
              <div><strong>Email:</strong> {profile?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;