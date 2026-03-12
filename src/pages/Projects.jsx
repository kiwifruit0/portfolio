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
          desc: "what happens when you implement a distributed key-value store in Go using the Raft consensus algorithm? find out in this project.",
          tech: ["Go", "Raft"],
          link: "github.com/tobyjennings/kv-store",
        },
        {
          name: "other project",
          desc: "this is a long sentence i want to check if wrapping works correctly in the project card component.",
          tech: ["Go", "Raft"],
          link: "github.com/tobyjennings/kv-store",
        },
      ]} />

    </div>
  );
}
