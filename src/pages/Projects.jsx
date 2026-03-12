import TwoColumnCards from "../components/ProjectCard";

export default function Projects() {
  return (
    <div className="page">

      <h1>Projects</h1>

      <p className="blank"></p>
      <TwoColumnCards cards={[
        {
          name: "neovim-portfolio",
          desc: "Developer portfolio in Neovim style.",
          tech: ["React", "Vite", "CSS"],
          link: "github.com/tobyjennings/portfolio",
        },
        {
          name: "kv-store",
          desc: "Distributed key-value store.",
          tech: ["Go", "Raft"],
          link: "github.com/tobyjennings/kv-store",
        },
      ]} />

    </div>
  );
}
