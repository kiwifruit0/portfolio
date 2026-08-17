import { Fragment } from "react";
import { healthSections, healthSummary } from "../content/skills";

const RULE = "=".repeat(120);

function Entry({ level, name, note }) {
  return (
    <p className="health-entry">
      <span className={`health-level level-${level.toLowerCase()}`}>- {level}</span>{" "}
      <b>{name}</b>: <span className="health-note">{note}</span>
    </p>
  );
}

export default function Skills() {
  return (
    <div className="page page-health">
      <h1>checkhealth</h1>

      <p className="health-rule">{RULE}</p>
      <p className="health-source">toby: require(&quot;toby.health&quot;).check()</p>
      <p className="blank"></p>

      <h3 className="health-section">Summary ~</h3>
      {healthSummary.map((entry) => (
        <Entry key={entry.name} {...entry} />
      ))}

      {healthSections.map((section) => (
        <Fragment key={section.id}>
          <p className="blank"></p>
          <h3 className="health-section">{section.title} ~</h3>
          {section.entries.map((entry) => (
            <Entry key={entry.name} {...entry} />
          ))}
        </Fragment>
      ))}

      <p className="blank"></p>
      <p className="health-rule">{RULE}</p>
      <p className="dim">
        Everything marked OK has been used on something real. WARN means I am still learning it and
        would say so in an interview.
      </p>
    </div>
  );
}
