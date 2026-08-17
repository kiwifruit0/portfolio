import { degree, priorEducation } from "../content/education";

export default function Education() {
  return (
    <div className="page">
      <h1>Education</h1>

      <p className="lede">
        Firsts in both years so far, and the modules I liked most were the ones closest to the
        hardware.
      </p>

      <p className="blank"></p>
      <h3>
        {degree.title} — {degree.org}
      </h3>
      <p className="entry-meta">{degree.period}</p>
      <p>{degree.grade}</p>

      {degree.years.map((year) => (
        <div key={year.label} className="entry">
          <p className="blank"></p>
          <p className="entry-label">{year.label}</p>
          <ul>
            {year.modules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </div>
      ))}

      {priorEducation.map((item) => (
        <div key={item.title} className="entry">
          <p className="blank"></p>
          <h3>
            {item.title} — {item.org}
          </h3>
          <p className="entry-meta">{item.period}</p>
          <p>{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
