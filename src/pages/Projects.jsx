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
        Some of the things I've built. Two of these won hackathons; one
        of them is the page you are reading.
      </p>

      {projects.map((project) => (
        <div key={project.id} className="entry project-entry">
          <p className="blank"></p>

          <h3>
            {/* data-offgrid: these chips have their own type and padding, so
                the cursor grid measures the heading from the name onwards. */}
            {project.award && <span className="award-badge" data-offgrid>{project.award}</span>}
            {project.badge && <span className="wip-badge" data-offgrid>{project.badge}</span>}
            {project.name}
          </h3>
          <p className="entry-meta">
            {project.tagline} · {project.period}
          </p>

          <p>{project.desc}</p>
          <ul>
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          {/* The preview sits after the writing, not before it. Leading with a
              screenshot pushed every entry's text below the fold. */}
          <ProjectShot
            mockup={project.mockup}
            image={project.image}
            alt={`${project.name} interface preview`}
            caption={project.shotCaption}
          />

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
        -- shipped projects show real screenshots; the rest are hand-drawn wireframes that
        follow the colorscheme --
      </p>
    </div>
  );
}
