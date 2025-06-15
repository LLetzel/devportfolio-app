// 🟢 ProjectForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectForm = ({ project, refresh, close }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [link, setLink] = useState(project?.link || '');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setLink(project.link);
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('link', link);
    if (image) form.append('image', image);

    if (project) {
      await axios.put(`https://devportfolio-backend-production.up.railway.app/api/projects/${project.id}`, form);
    } else {
      await axios.post('https://devportfolio-backend-production.up.railway.app/api/projects', form);
    }

    refresh();
    close();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 mb-6 rounded shadow">
      <h2 className="text-lg font-bold mb-2">{project ? 'Editar' : 'Novo'} Projeto</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className="input" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição" className="input mt-2" required />
      <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link" className="input mt-2" />
      <input type="file" onChange={e => setImage(e.target.files[0])} className="mt-2" />
      <div className="mt-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Salvar</button>
        <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={close}>Cancelar</button>
      </div>
    </form>
  );
};

export default ProjectForm;
