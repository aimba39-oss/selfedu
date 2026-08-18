import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getWritingTask } from "../data/writingData";

function WritingTest() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const task = useMemo(
    () => (taskId ? getWritingTask(taskId) : undefined),
    [taskId],
  );

  const [text, setText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(
    task ? task.minutes * 60 : 0,
  );
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    if (!task) return;

    const saved = localStorage.getItem(
      `selfedu-writing-${task.id}`,
    );

    if (saved !== null) {
      setText(saved);
    }
  }, [task]);

  useEffect(() => {
    if (!task) return;

    localStorage.setItem(
      `selfedu-writing-${task.id}`,
      text,
    );
  }, [task, text]);

  useEffect(() => {
    if (!task) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);

          navigate(`/writing/${task.id}/results`, {
            state: {
              answer: text,
              autoSubmitted: true,
            },
          });

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [navigate, task, text]);

  if (!task) {
    return (
      <div className="reading-error-page">
        <p className="eyebrow">WRITING</p>
        <h1>Task not found.</h1>

        <Link to="/writing" className="primary-button">
          Back to Writing
        </Link>
      </div>
    );
  }

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const progress = Math.min(
    100,
    (wordCount / task.wordTarget) * 100,
  );

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (secondsLeft % 60)
    .toString()
    .padStart(2, "0");

  const submit = () => {
    navigate(`/writing/${task.id}/results`, {
      state: {
        answer: text,
        autoSubmitted: false,
      },
    });
  };

  return (
    <div className="writing-test-page">
      <header className="writing-test-header">
        <div>
          <Link
            to="/writing"
            className="reading-back-link"
          >
            ← Writing
          </Link>

          <p className="eyebrow">
            {task.type === "task-1" ? "TASK 1" : "TASK 2"}
          </p>

          <h1>{task.title}</h1>
        </div>

        <div className="writing-test-actions">
          <div
            className={
              secondsLeft <= 300
                ? "reading-timer danger"
                : "reading-timer"
            }
          >
            <span>TIME</span>
            <strong>
              {minutes}:{seconds}
            </strong>
          </div>

          <button
            className="reading-submit-button"
            type="button"
            onClick={() => setShowSubmit(true)}
          >
            Submit
          </button>
        </div>
      </header>

      <div className="writing-workspace">
        <aside className="writing-prompt-panel">
          <div className="writing-prompt-top">
            <span className="dashboard-label">
              QUESTION
            </span>

            <span className="writing-task-badge">
              {task.wordTarget}+ words
            </span>
          </div>

          <h2>{task.prompt}</h2>

          <div className="writing-requirements">
            <span className="dashboard-label">
              INSTRUCTIONS
            </span>

            {task.notes.map((note) => (
              <p key={note}>• {note}</p>
            ))}
          </div>
        </aside>

        <section className="writing-editor-panel">
          <div className="writing-editor-toolbar">
            <div>
              <span className="dashboard-label">
                YOUR RESPONSE
              </span>

              <span className="writing-save-status">
                Saved automatically
              </span>
            </div>

            <div className="writing-word-progress">
              <span>
                {wordCount} / {task.wordTarget}
              </span>

              <div>
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Begin writing your response..."
            spellCheck
          />

          <div className="writing-editor-footer">
            <span>
              {wordCount} words
            </span>

            <span>
              Aim for clarity, development, and accurate language.
            </span>
          </div>
        </section>
      </div>

      <div className="writing-bottom-actions">
        <Link
          className="secondary-button"
          to="/writing"
        >
          Exit task
        </Link>

        <button
          className="primary-button"
          type="button"
          onClick={() => setShowSubmit(true)}
        >
          Submit for review
          <span>↗</span>
        </button>
      </div>

      {showSubmit && (
        <div
          className="reading-modal-backdrop"
          role="presentation"
          onClick={() => setShowSubmit(false)}
        >
          <div
            className="reading-submit-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="dashboard-label">
              READY TO SUBMIT?
            </span>

            <h2>Submit your writing?</h2>

            <p>
              You have written {wordCount} words.
              Once submitted, the response will move to the
              evaluation screen.
            </p>

            <div className="reading-modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowSubmit(false)}
              >
                Continue writing
              </button>

              <button
                className="primary-button"
                type="button"
                onClick={submit}
              >
                Submit
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WritingTest;