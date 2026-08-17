import ProjectShot from "../components/ProjectShot";
import { projects } from "../content/projects";

function normalizeUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function Projects() {
  return (
    <div className="page">
      <h1>Projects</h1>

      <p className="lede">
        Things I have built, in the order I am most proud of them. Two of these won hackathons; one
        of them is the page you are reading.
      </p>

      {projects.map((project) => (
        <div key={project.id} className="entry project-entry">
          <p className="blank"></p>

          <h3>
            {project.award && <span className="award-badge">{project.award}</span>}
            {project.badge && <span className="wip-badge">{project.badge}</span>}
            {project.name}
          </h3>
          <p className="entry-meta">
            {project.tagline} · {project.period}
          </p>

          <ProjectShot
            mockup={project.mockup}
            image={project.image}
            alt={`${project.name} interface preview`}
            caption={project.shotCaption}
          />

          <p>{project.desc}</p>
          <ul>
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="tag-row">{project.tech.map((tech) => `[${tech}]`).join("  ")}</p>
          {project.link && (
            <p className="link-row">
              ↗{" "}
              <a href={normalizeUrl(project.link)} target="_blank" rel="noopener noreferrer">
                {project.link}
              </a>
            </p>
          )}
        </div>
      ))}

      <p className="blank"></p>
      <p className="dim">
        -- previews are hand-drawn wireframes that follow the colorscheme; swap them for real
        screenshots in src/assets/previews/ --
      </p>
    </div>
  );
}
