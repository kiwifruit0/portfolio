import { roles, volunteering } from "../content/experience";

export default function Experience() {
  return (
    <div className="page">
      <h1>Experience</h1>

      <p className="lede">
        Two software internships in London, plus three years of part-time work that taught me more
        about difficult conversations than any module did.
      </p>

      {roles.map((role) => (
        <div key={role.id} className="entry">
          <p className="blank"></p>
          <h3>
            {role.title} — {role.org}
          </h3>
          <p className="entry-meta">
            {role.place} · {role.period}
          </p>
          <p>{role.summary}</p>
          <ul>
            {role.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="tag-row">{role.tags.map((tag) => `[${tag}]`).join("  ")}</p>
        </div>
      ))}

      <p className="blank"></p>
      <h3>Volunteering</h3>
      <ul>
        {volunteering.map((item) => (
          <li key={item.title}>
            <b>{item.title}</b> ({item.period}) — {item.detail}
          </li>
        ))}
      </ul>
    </div>
  );
}
