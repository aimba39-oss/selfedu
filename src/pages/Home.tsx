import { Link } from "react-router-dom";

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

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">PERSONAL IELTS PREPARATION</p>

          <h1>
            Your IELTS
            <br />
            <span className="hero-dark">goal.</span>
            <br />
            <span className="hero-muted">Your path.</span>
          </h1>

          <p className="hero-description">
            A premium IELTS preparation experience built around your
            progress, your weaknesses, and intelligent AI coaching.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/practice">
              Start your journey
              <span>↗</span>
            </Link>

            <a className="secondary-button" href="#skills">
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
              <span className="ai-label">PERSONAL INTERVIEWER</span>

              <h2>Ready when you are.</h2>

              <p>Let&apos;s improve your next band score.</p>
            </div>

            <Link className="ai-button" to="/ai-coach">
              Enter AI Coach
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="skills-section" id="skills">
        <div className="section-intro">
          <div>
            <p className="eyebrow">THE FOUR SKILLS</p>

            <h2>
              Train every part
              <br />
              of the exam.
            </h2>
          </div>

          <p className="section-description">
            One platform for Listening, Reading, Writing, and Speaking —
            designed to turn practice into measurable progress.
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

                <span className="skill-arrow">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="progress-section" id="progress">
        <div className="section-intro progress-intro">
          <div>
            <p className="eyebrow">YOUR PROGRESS</p>

            <h2>
              See where
              <br />
              you&apos;re going.
            </h2>
          </div>

          <p className="section-description">
            Every session becomes part of a clearer picture of your IELTS
            performance.
          </p>
        </div>

        <div className="progress-card">
          <div className="progress-top">
            <div>
              <span className="small-label">
                ESTIMATED OVERALL BAND
              </span>

              <strong>7.2</strong>
            </div>

            <div className="trend">
              <span>+0.8</span>
              <small>this month</small>
            </div>
          </div>

          <div className="graph">
            <div className="graph-gridline grid-one" />
            <div className="graph-gridline grid-two" />
            <div className="graph-gridline grid-three" />

            <svg
              className="graph-svg"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0"
                  x2="1"
                >
                  <stop offset="0%" stopColor="#b7b7b3" />
                  <stop offset="45%" stopColor="#b89a5a" />
                  <stop offset="100%" stopColor="#222326" />
                </linearGradient>
              </defs>

              <path
                d="M0,240 C120,225 165,205 250,210 C350,216 380,165 470,178 C570,194 595,136 700,150 C815,165 820,100 1000,62"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            <span className="graph-dot dot-one" />
            <span className="graph-dot dot-two" />
            <span className="graph-dot dot-three" />
            <span className="graph-dot dot-four" />
            <span className="graph-dot dot-five" />
          </div>

          <div className="skills-values">
            <div>
              <span>Listening</span>
              <strong>7.5</strong>
            </div>

            <div>
              <span>Reading</span>
              <strong>7.0</strong>
            </div>

            <div>
              <span>Writing</span>
              <strong>6.5</strong>
            </div>

            <div>
              <span>Speaking</span>
              <strong>7.5</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="closing-section" id="ai">
        <p className="eyebrow">INTELLIGENT PREPARATION</p>

        <h2>
          Practice with purpose.
          <br />
          <span>Improve with SelfEDU.</span>
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