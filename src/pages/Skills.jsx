import { Fragment } from "react";
import { skillFooter, skillSections } from "../content/skills";

// Name column width, in characters. The padding is real spaces inside a
// white-space: pre-wrap row, so the rendered columns line up with the cursor
// grid rather than drifting away from it.
const NAME_WIDTH = 18;

const allEntries = skillSections.flatMap((section) => section.entries);
const loadedCount = allEntries.filter((entry) => entry.state === "loaded").length;
const learningCount = allEntries.length - loadedCount;

function Entry({ name, state, note }) {
  const marker = state === "loaded" ? "●" : "○";
  const label = name.length >= NAME_WIDTH ? `${name} ` : name.padEnd(NAME_WIDTH, " ");

  return (
    <p className={`skill-row ${state}`}>
      <span className="skill-marker">{marker}</span>{" "}
      <span className="skill-name">{label}</span>
      <span className="skill-note">{note}</span>
    </p>
  );
}

export default function Skills() {
  return (
    <div className="page page-skills">
      <h1>Skills</h1>

      <p className="skill-legend">
        <span className="skill-marker loaded-marker">●</span> in use ({loadedCount})
        <span className="skill-legend-gap"> </span>
        <span className="skill-marker learning-marker">○</span> still loading ({learningCount})
      </p>

      {skillSections.map((section) => (
        <Fragment key={section.id}>
          <p className="blank"></p>
          <h3 className="skill-section">{section.title}</h3>
          {section.entries.map((entry) => (
            <Entry key={entry.name} {...entry} />
          ))}
        </Fragment>
      ))}

      <p className="blank"></p>
      {skillFooter.map((line) => (
        <p key={line} className="dim">
          {line}
        </p>
      ))}
    </div>
  );
}
