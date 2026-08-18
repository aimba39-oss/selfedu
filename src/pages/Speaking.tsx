import { Link } from "react-router-dom";

function Speaking() {
  return (
    <div className="speaking-page">
      <section className="speaking-hero">
        <div>
          <p className="eyebrow">IELTS AI SPEAKING</p>

          <h1>
            Speak with
            <br />
            <span>confidence.</span>
          </h1>

          <p className="speaking-hero-description">
            Practice natural IELTS conversations with an adaptive AI
            interviewer, then understand exactly where your speaking can
            improve.
          </p>

          <div className="speaking-actions">
            <Link className="primary-button" to="/speaking/interview?part=1">
              Start AI interview
              <span>↗</span>
            </Link>

            <Link className="secondary-button" to="/progress">
              View your progress
            </Link>
          </div>
        </div>

        <div className="speaking-avatar-stage">
          <div className="speaking-avatar-orbit orbit-a" />
          <div className="speaking-avatar-orbit orbit-b" />
          <div className="speaking-avatar-halo" />

          <div className="speaking-avatar">
            <div className="avatar-face">
              <span className="avatar-eye left" />
              <span className="avatar-eye right" />
              <span className="avatar-mouth" />
            </div>
          </div>

          <div className="speaking-avatar-label">
            <span>AI INTERVIEWER</span>
            <strong>Anna</strong>
            <small>Adaptive · Professional · Natural</small>
          </div>
        </div>
      </section>

      <section className="speaking-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">THE SPEAKING TEST</p>
            <h2>Practice like a real conversation.</h2>
          </div>

          <span className="dashboard-muted">
            Part 1 · Part 2 · Part 3
          </span>
        </div>

        <div className="speaking-parts-grid">
          <Link
            className="speaking-part-card dashboard-glass-card"
            to="/speaking/interview?part=1"
          >
            <span>01</span>
            <h3>Part 1</h3>
            <p>
              Familiar topics, natural questions, and a smooth conversation
              to get you speaking.
            </p>
            <small>4–5 minutes · Start →</small>
          </Link>

          <Link
            className="speaking-part-card dashboard-glass-card"
            to="/speaking/interview?part=2"
          >
            <span>02</span>
            <h3>Part 2</h3>
            <p>
              Receive a topic, prepare your response, and speak continuously
              with the AI interviewer.
            </p>
            <small>3–4 minutes · Start →</small>
          </Link>

          <Link
            className="speaking-part-card dashboard-glass-card"
            to="/speaking/interview?part=3"
          >
            <span>03</span>
            <h3>Part 3</h3>
            <p>
              Deeper discussion, abstract questions, and opportunities to
              develop your ideas.
            </p>
            <small>4–5 minutes · Start →</small>
          </Link>
        </div>
      </section>

      <section className="speaking-section speaking-coach-card">
        <div>
          <p className="eyebrow">AFTER THE INTERVIEW</p>

          <h2>
            Don&apos;t just get a score.
            <br />
            <span>Know how to improve.</span>
          </h2>

          <p>
            Your future AI evaluation screen will break performance into
            Fluency & Coherence, Lexical Resource, Grammar, and
            Pronunciation, then turn those findings into a practical plan.
          </p>
        </div>

        <div className="speaking-score-preview">
          <span>ESTIMATED BAND</span>
          <strong>7.5</strong>

          <div>
            <span>Fluency</span>
            <strong>7.5</strong>
          </div>

          <div>
            <span>Vocabulary</span>
            <strong>7.5</strong>
          </div>

          <div>
            <span>Grammar</span>
            <strong>7.0</strong>
          </div>

          <div>
            <span>Pronunciation</span>
            <strong>7.5</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Speaking;