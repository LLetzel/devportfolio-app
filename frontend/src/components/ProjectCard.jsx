// src/components/ProjectCard.jsx
const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      {project.image && (
        <img
          src={`https://devportfolio-backend-production.up.railway.app/uploads/${project.image}`}
          alt={project.title}
          className="h-40 w-full object-cover rounded mb-2"
        />
      )}
      <h2 className="text-xl font-semibold">{project.title}</h2>
      <p className="text-sm">{project.description}</p>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm mt-2 inline-block"
        >
          Ver projeto
        </a>
      )}
    </div>
  );
};

export default ProjectCard;
