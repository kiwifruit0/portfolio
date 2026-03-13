import TwoColumnCards from "../components/ProjectCard";

export default function Projects() {
  return (
    <div className="page">

      <h1>Projects</h1>

      <p className="blank"></p>
      <TwoColumnCards cards={[
        {
          name: "1st-place-soton-ds-x-wecs-hackathon",
          desc: "Built a location-aware full-stack app to gamify real-world activity with category stats, weighted rewards, and leaderboards.",
          tech: ["React", "Python", "FastAPI", "REST API"],
          link: "github.com/Ryan-Shino/WECSHackathonProject",
        },
        {
          name: "machine-learning-grade-predictor",
          desc: "Predicted student grades from academic and non-academic features; achieved ~15% improvement over a baseline linear model.",
          tech: ["Python", "Machine Learning", "Regression"],
          link: "github.com/kiwifruit0/grade_predictor",
        }
      ]} />

    </div>
  );
}
