import { profile, highlights } from "./profile";
import { roles, volunteering } from "./experience";
import { degree, priorEducation } from "./education";
import { projects } from "./projects";
import { healthSections, healthSummary } from "./skills";

// A flat, greppable view of everything on the site.
// Powers <leader>fg (live grep) and the finder's preview pane.
function build() {
  const entries = [];
  const push = (file, text) => {
    const trimmed = String(text || "").trim();
    if (trimmed) {
      entries.push({ file, line: 0, text: trimmed });
    }
  };

  push("index.md", `${profile.name} - ${profile.role}`);
  push("index.md", profile.status);
  push("index.md", `Graduating ${profile.graduating}, based in ${profile.location}`);
  highlights.forEach((h) => push("index.md", `${h.label}: ${h.detail}`));

  projects.forEach((p) => {
    push("projects.cpp", `${p.name} - ${p.tagline}`);
    push("projects.cpp", p.desc);
    p.points.forEach((point) => push("projects.cpp", point));
    push("projects.cpp", `stack: ${p.tech.join(", ")}`);
    if (p.link) push("projects.cpp", p.link);
  });

  roles.forEach((r) => {
    push("experience.py", `${r.title} - ${r.org}, ${r.place} (${r.period})`);
    push("experience.py", r.summary);
    r.points.forEach((point) => push("experience.py", point));
  });
  volunteering.forEach((v) => push("experience.py", `${v.title} (${v.period}) - ${v.detail}`));

  push("education.sh", `${degree.title}, ${degree.org} (${degree.period})`);
  push("education.sh", degree.grade);
  degree.years.forEach((y) => push("education.sh", `${y.label}: ${y.modules.join(", ")}`));
  priorEducation.forEach((e) => push("education.sh", `${e.title}, ${e.org} (${e.period}) - ${e.detail}`));

  healthSummary.forEach((entry) => push("skills.health", `- ${entry.level} ${entry.name}: ${entry.note}`));
  healthSections.forEach((section) => {
    push("skills.health", `${section.title} ~`);
    section.entries.forEach((entry) =>
      push("skills.health", `- ${entry.level} ${entry.name}: ${entry.note}`)
    );
  });

  push("contact.java", `email ${profile.email}`);
  push("contact.java", `github ${profile.github}`);
  push("contact.java", `linkedin ${profile.linkedin}`);
  push("contact.java", `website ${profile.website}`);
  push("contact.java", `phone ${profile.phone}`);

  // Number lines per file so grep results read like real grep output.
  const counters = {};
  return entries.map((entry) => {
    counters[entry.file] = (counters[entry.file] || 0) + 1;
    return { ...entry, line: counters[entry.file] };
  });
}

export const searchIndex = build();
