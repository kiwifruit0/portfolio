import TwoColumnCards from "../components/ProjectCard";

export default function Projects() {
  return (
    <div className="page">

      <h1>Projects and Achievements</h1>

      <p>
        I like building projects that solve real problems and get used by real people.
        Here are a few I've enjoyed working on.
      </p>

      <p className="blank"></p>
      <TwoColumnCards
        cards={[
          {
            name: "1st place - ElevenLabs track at SotonHack 2026",
            desc: "Voice-based social media that joins the semi-anonymous forum style of Reddit and Quora with the daily interaction between friends seen in BeReal. Won the \"Best use of ElevenLabs\" track with our voice assistant.",
            tech: ["React", "Python", "FastAPI", "Gemini API", "MongoDB"],
            link: "github.com/kiwifruit0/Echo",
          },
          {
            name: "1st place - Soton Data Science x WECS Hackathon 2026",
            desc: "Location-aware, full stack app that turns going outside into a game with category-based stats and leaderboards. I worked on the API integration, as well as the geolocation + Mapbox place classification.",
            tech: ["React", "Tailwind", "Python", "FastAPI", "REST API"],
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
