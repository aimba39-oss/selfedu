import { Link } from "react-router-dom";

const modes = [
  {
    number: "01",
    title: "Listening",
    subtitle: "Hear. Understand. Improve.",
    description:
      "Realistic listening practice with timed sections, detailed results, and targeted review.",
    route: "/listening",
    icon: "◒",
  },
  {
    number: "02",
    title: "Reading",
    subtitle: "Read. Analyze. Master.",
    description:
      "Cambridge-style passages, question strategies, timing, and intelligent explanations.",
    route: "/reading",
    icon: "⌕",
  },
  {
    number: "03",
    title: "Writing",
    subtitle: "Write. Refine. Score higher.",
    description:
      "Task 1 and Task 2 practice with structured AI evaluation across all four criteria.",
    route: "/writing",
    icon: "✦",
  },
  {
    number: "04",
    title: "Speaking",
    subtitle: "Speak. Connect. Improve.",
    description:
      "Natural conversations with your adaptive AI interviewer and detailed performance feedback.",
    route: "/speaking",
    icon: "◉",
  },
];

function Practice() {
  return (
    <div className="practice-page">
      <section className="practice-hero">
        <div>
          <p className="eyebrow">SELFEDU PRACTICE</p>

          <h1>
            Train with
            <br />
            <span>purpose.</span>
          </h1>

          <p className="practice-hero-description">
            Choose a skill, take a realistic practice session, and turn every
            attempt into measurable progress.
          </p>

          <div className="practice-quick-actions">
            <Link className="dashboard-primary-action" to="/reading">
              Start a full test
              <span>↗</span>
            </Link>

            <Link className="practice-text-link" to="/ai-coach">
              Ask AI Coach what to practice
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="practice-hero-orb">
          <div className="practice-orb-ring ring-a" />
          <div className="practice-orb-ring ring-b" />
          <div className="practice-orb-core">
            <span>SELF</span>
            <strong>EDU</strong>
          </div>
        </div>
      </section>

      <section className="practice-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">CHOOSE YOUR SKILL</p>
            <h2>Four ways to improve.</h2>
          </div>

          <span className="dashboard-muted">
            Practice at your own pace
          </span>
        </div>

        <div className="practice-grid">
          {modes.map((mode) => (
            <Link
              className="practice-mode-card dashboard-glass-card"
              to={mode.route}
              key={mode.title}
            >
              <div className="practice-mode-top">
                <span>{mode.number}</span>
                <span className="practice-mode-icon">{mode.icon}</span>
              </div>

              <div className="practice-mode-middle">
                <span className="practice-mode-kicker">
                  {mode.subtitle}
                </span>

                <h3>{mode.title}</h3>

                <p>{mode.description}</p>
              </div>

              <div className="practice-mode-bottom">
                <span>Open practice</span>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="practice-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">SMART PRACTICE</p>
            <h2>What should you do next?</h2>
          </div>
        </div>

        <div className="practice-recommendation">
          <div className="practice-recommendation-content">
            <span className="dashboard-label">AI RECOMMENDATION</span>

            <h2>
              Focus on
              <br />
              Matching Headings.
            </h2>

            <p>
              Your recent Reading results suggest this question type is
              currently costing you the most points. A focused session could
              improve your accuracy before your next full test.
            </p>

            <Link
              className="recommendation-button"
              to="/reading"
            >
              Start targeted Reading
              <span>↗</span>
            </Link>
          </div>

          <div className="practice-recommendation-score">
            <span>ACCURACY</span>
            <strong>61%</strong>
            <small>Last 30 days</small>
          </div>
        </div>
      </section>

      <section className="practice-section practice-bottom-grid">
        <article className="practice-stat-card dashboard-glass-card">
          <span className="dashboard-label">THIS WEEK</span>
          <strong>4h 28m</strong>
          <p>Total practice time</p>

          <div className="mini-week">
            {[42, 64, 28, 76, 54, 35, 18].map(
              (height, index) => (
                <span
                  key={index}
                  style={{ height: `${height}%` }}
                />
              ),
            )}
          </div>
        </article>

        <article className="practice-stat-card dashboard-glass-card">
          <span className="dashboard-label">QUESTIONS</span>
          <strong>186</strong>
          <p>Answered this month</p>

          <div className="practice-stat-line">
            <span style={{ width: "72%" }} />
          </div>

          <small>72% of your monthly goal</small>
        </article>

        <article className="practice-stat-card dashboard-glass-card">
          <span className="dashboard-label">STREAK</span>
          <strong>12</strong>
          <p>Consecutive study days</p>

          <Link
            className="dashboard-inline-link"
            to="/progress"
          >
            View progress
            <span>→</span>
          </Link>
        </article>
      </section>
    </div>
  );
}

export default Practice;