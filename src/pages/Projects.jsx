import TwoColumnCards from "../components/ProjectCard";

export default function Projects() {
  return (
    <div className="page">

      <h1>Projects</h1>

      <p>
        I like building projects that solve real problems and get used by real people.
        Here are a few I've enjoyed working on.
      </p>

      <p className="blank"></p>
      <TwoColumnCards
        cards={[
          {
            name: "1st place — Soton Data Science x WECS Hackathon",
            desc: "Built a location-aware full-stack app that turns going outside into a game: category-based stats, weighted rewards, and leaderboards. I worked on the React frontend + API integration, plus the geolocation + Mapbox place classification.",
            tech: ["React", "Tailwind", "Python", "FastAPI", "Mapbox", "REST API"],
            link: "github.com/Ryan-Shino/WECSHackathonProject",
          },
          {
            name: "Machine learning grade predictor",
            desc: "A small ML app that predicts student grades from academic + non-academic attributes. Built the regression model from scratch in Python, did feature engineering/tuning, and got ~15% improvement over a baseline linear model.",
            tech: ["Python", "Machine Learning", "Regression"],
            link: "github.com/kiwifruit0/grade_predictor",
          },
          {
            name: "Neovim-inspired portfolio website",
            desc: "The site you're on right now! A single-page React app styled like my favourite IDE, with a custom cursor grid and resizable panels",
            tech: ["React", "Vite", "CSS"],
            link: "github.com/kiwifruit0/portfolio",
          },
        ]}
      />

    </div>
  );
}
