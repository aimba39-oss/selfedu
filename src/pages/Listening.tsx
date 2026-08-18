import { Link } from "react-router-dom";
import { listeningTests } from "../data/listeningData";

function Listening() {
  return (
    <div className="listening-library-page">
      <section className="listening-hero">
        <div>
          <p className="eyebrow">IELTS ACADEMIC LISTENING</p>

          <h1>
            Train your
            <br />
            <span>ear.</span>
          </h1>

          <p className="listening-hero-description">
            Build concentration, accuracy, and confidence with structured
            listening practice and detailed results.
          </p>

          <div className="reading-library-stats">
            <div>
              <strong>4</strong>
              <span>Sections</span>
            </div>

            <div>
              <strong>16</strong>
              <span>Questions</span>
            </div>

            <div>
              <strong>30</strong>
              <span>Minutes</span>
            </div>
          </div>
        </div>

        <div className="listening-visual">
          <div className="listening-wave listening-wave-one" />
          <div className="listening-wave listening-wave-two" />

          <div className="listening-player-orb">
            <div className="listening-player-core">◉</div>
          </div>
        </div>
      </section>

      <section className="listening-tests-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">LISTENING LIBRARY</p>
            <h2>Choose your test.</h2>
          </div>

          <span className="dashboard-muted">
            Original IELTS-style practice
          </span>
        </div>

        <div className="listening-tests-grid">
          {listeningTests.map((test) => (
            <Link
              className="listening-test-card dashboard-glass-card"
              to={`/listening/test/${test.testNumber}`}
              key={test.id}
            >
              <div className="listening-test-number">
                0{test.testNumber}
              </div>

              <div>
                <span>{test.difficulty}</span>
                <h3>{test.title}</h3>
                <p>4 sections · 16 questions</p>
              </div>

              <span className="listening-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Listening;