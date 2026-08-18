import { Link } from "react-router-dom";
import { writingTasks } from "../data/writingData";

function Writing() {
  return (
    <div className="writing-library-page">
      <section className="writing-hero">
        <div>
          <p className="eyebrow">IELTS ACADEMIC WRITING</p>

          <h1>
            Write with
            <br />
            <span>precision.</span>
          </h1>

          <p className="writing-hero-description">
            Practice Task 1 and Task 2 in a focused writing environment
            designed around structure, clarity, and measurable improvement.
          </p>

          <div className="reading-library-stats">
            <div>
              <strong>2</strong>
              <span>Task types</span>
            </div>

            <div>
              <strong>60</strong>
              <span>Minutes total</span>
            </div>

            <div>
              <strong>4</strong>
              <span>AI criteria</span>
            </div>
          </div>
        </div>

        <div className="writing-hero-visual">
          <div className="writing-orbit writing-orbit-a" />
          <div className="writing-orbit writing-orbit-b" />

          <div className="writing-document">
            <span>SELFEDU IELTS</span>
            <strong>WRITE</strong>
            <small>THINK · STRUCTURE · EXPRESS</small>

            <div className="writing-document-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>

      <section className="writing-tasks-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">CHOOSE YOUR TASK</p>
            <h2>Build your writing skill.</h2>
          </div>

          <span className="dashboard-muted">
            Original IELTS-style practice
          </span>
        </div>

        <div className="writing-task-grid">
          {writingTasks.map((task) => (
            <Link
              key={task.id}
              to={`/writing/${task.id}`}
              className="writing-task-card dashboard-glass-card"
            >
              <div className="writing-task-top">
                <span>
                  {task.type === "task-1" ? "TASK 1" : "TASK 2"}
                </span>

                <span>↗</span>
              </div>

              <div className="writing-task-content">
                <span className="writing-task-kicker">
                  {task.minutes} minutes · {task.wordTarget}+ words
                </span>

                <h3>{task.title}</h3>

                <p>{task.prompt}</p>
              </div>

              <div className="writing-task-bottom">
                <span>
                  {task.notes.length} task requirements
                </span>

                <strong>Start</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Writing;