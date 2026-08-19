import { Link } from "react-router-dom";

import {
  getAllSkillTrends,
  getAverageBand,
  getProgressAttempts,
  getProgressRecommendation,
  type ProgressSkill,
} from "../lib/progress";

const skills = [
  {
    number: "01",
    title: "Listening",
    description:
      "Build accuracy, comprehension, and confidence with realistic IELTS listening practice.",
    meta: "Practice · Audio · Analysis",
    icon: "◒",
    route: "/listening",
  },
  {
    number: "02",
    title: "Reading",
    description:
      "Master passages, timing, question types, and the strategies behind stronger answers.",
    meta: "Passages · Timing · AI Help",
    icon: "⌕",
    route: "/reading",
  },
  {
    number: "03",
    title: "Writing",
    description:
      "Write with purpose and get structured AI feedback across every IELTS assessment criterion.",
    meta: "Task 1 · Task 2 · AI Review",
    icon: "✦",
    route: "/writing",
  },
  {
    number: "04",
    title: "Speaking",
    description:
      "Practice natural conversations with an adaptive AI interviewer and improve your confidence.",
    meta: "AI Interview · Fluency · Feedback",
    icon: "◉",
    route: "/speaking",
  },
];

const skillOrder: ProgressSkill[] = [
  "listening",
  "reading",
  "writing",
  "speaking",
];

function Home() {
  const attempts = getProgressAttempts();
  const averageBand = getAverageBand();
  const trends = getAllSkillTrends();
  const recommendation =
    getProgressRecommendation();

  const getBand = (skill: ProgressSkill) => {
    const band = trends[skill].latestBand;

    return typeof band === "number"
      ? band.toFixed(1)
      : "—";
  };

  const getTrend = (skill: ProgressSkill) => {
    const trend = trends[skill];

    if (trend.change === null) {
      return "—";
    }

    return `${trend.change > 0 ? "+" : ""}${trend.change.toFixed(1)}`;
  };

  const getTrendLabel = (
    skill: ProgressSkill,
  ) => {
    const status = trends[skill].status;

    if (status === "improving") {
      return "improving";
    }

    if (status === "declining") {
      return "declining";
    }

    if (status === "stable") {
      return "stable";
    }

    return "not enough data";
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            PERSONAL IELTS PREPARATION
          </p>

          <h1>
            Your IELTS
            <br />
            <span className="hero-dark">
              goal.
            </span>
            <br />
            <span className="hero-muted">
              Your path.
            </span>
          </h1>

          <p className="hero-description">
            A premium IELTS preparation experience built
            around your progress, your weaknesses, and
            intelligent AI coaching.
          </p>

          <div className="hero-actions">
            <Link
              className="primary-button"
              to="/practice"
            >
              Start your journey
              <span>↗</span>
            </Link>

            <a
              className="secondary-button"
              href="#skills"
            >
              Explore platform
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>4</strong>
              <span>Core skills</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Personal coach</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Practice</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />

          <div className="ai-floating-card">
            <div className="ai-status">
              <span className="status-dot" />
              AI COACH
            </div>

            <div className="ai-portrait">
              <div className="portrait-aura" />
              <div className="portrait-ring ring-one" />
              <div className="portrait-ring ring-two" />

              <div className="portrait-core">
                <span>S</span>
              </div>
            </div>

            <div className="ai-copy">
              <span className="ai-label">
                PERSONAL INTERVIEWER
              </span>

              <h2>
                Ready when you are.
              </h2>

              <p>
                Let&apos;s improve your next band score.
              </p>
            </div>

            <Link
              className="ai-button"
              to="/ai-coach"
            >
              Enter AI Coach
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="skills-section"
        id="skills"
      >
        <div className="section-intro">
          <div>
            <p className="eyebrow">
              THE FOUR SKILLS
            </p>

            <h2>
              Train every part
              <br />
              of the exam.
            </h2>
          </div>

          <p className="section-description">
            One platform for Listening, Reading, Writing,
            and Speaking — designed to turn practice into
            measurable progress.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => (
            <Link
              className="skill-card"
              to={skill.route}
              key={skill.title}
            >
              <div className="skill-top">
                <span>{skill.number}</span>

                <span className="skill-icon">
                  {skill.icon}
                </span>
              </div>

              <div className="skill-content">
                <h3>{skill.title}</h3>

                <p>{skill.description}</p>
              </div>

              <div className="skill-bottom">
                <span>{skill.meta}</span>

                <span className="skill-arrow">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="progress-section"
        id="progress"
      >
        <div className="section-intro progress-intro">
          <div>
            <p className="eyebrow">
              YOUR PROGRESS
            </p>

            <h2>
              See where
              <br />
              you&apos;re going.
            </h2>
          </div>

          <p className="section-description">
            This section is generated from your actual saved
            attempts. Nothing is filled in until you practice.
          </p>
        </div>

        <div className="progress-card">
          <div className="progress-top">
            <div>
              <span className="small-label">
                ESTIMATED OVERALL BAND
              </span>

              <strong>
                {averageBand !== null
                  ? averageBand.toFixed(1)
                  : "—"}
              </strong>
            </div>

            <div className="trend">
              <span>
                {attempts.length}
              </span>

              <small>
                saved attempts
              </small>
            </div>
          </div>

          <div className="skills-values">
            {skillOrder.map((skill) => (
              <div key={skill}>
                <span>
                  {skill.charAt(0).toUpperCase() +
                    skill.slice(1)}
                </span>

                <strong>
                  {getBand(skill)}
                </strong>

                <small
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "var(--text-muted)",
                    fontSize: "9px",
                  }}
                >
                  {getTrend(skill)} ·{" "}
                  {getTrendLabel(skill)}
                </small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="progress-section"
        style={{ paddingTop: 0 }}
      >
        <div className="section-intro">
          <div>
            <p className="eyebrow">
              NEXT MOVE
            </p>

            <h2>
              Your dashboard
              <br />
              has a plan.
            </h2>
          </div>

          <div>
            <p className="section-description">
              {recommendation.description}
            </p>

            <Link
              className="primary-button"
              to={recommendation.route}
              style={{ marginTop: "22px" }}
            >
              {recommendation.actionLabel}
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="closing-section"
        id="ai"
      >
        <p className="eyebrow">
          INTELLIGENT PREPARATION
        </p>

        <h2>
          Practice with purpose.
          <br />
          <span>
            Improve with SelfEDU.
          </span>
        </h2>

        <Link
          className="primary-button closing-button"
          to="/ai-coach"
        >
          Explore the AI coach
          <span>↗</span>
        </Link>
      </section>
    </div>
  );
}

export default Home;