import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getListeningTest,
  type ListeningQuestion,
} from "../data/listeningData";

type AnswerMap = Record<number, string>;

function ListeningTest() {
  const { testNumber } = useParams();
  const navigate = useNavigate();

  const testId = Number(testNumber);

  const listeningTest = useMemo(
    () => getListeningTest(testId),
    [testId],
  );

  const [activeSection, setActiveSection] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [secondsLeft, setSecondsLeft] = useState(1800);
  const [playing, setPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    if (!listeningTest) return;

    const saved = localStorage.getItem(
      `selfedu-listening-${listeningTest.id}`,
    );

    if (saved) {
      try {
        setAnswers(JSON.parse(saved) as AnswerMap);
      } catch {
        localStorage.removeItem(
          `selfedu-listening-${listeningTest.id}`,
        );
      }
    }
  }, [listeningTest]);

  useEffect(() => {
    if (!listeningTest) return;

    localStorage.setItem(
      `selfedu-listening-${listeningTest.id}`,
      JSON.stringify(answers),
    );
  }, [answers, listeningTest]);

  useEffect(() => {
    if (!listeningTest) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);

          navigate(
            `/listening/test/${testId}/results`,
            {
              state: {
                answers,
                autoSubmitted: true,
              },
            },
          );

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [answers, listeningTest, navigate, testId]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!listeningTest) {
    return (
      <div className="reading-error-page">
        <p className="eyebrow">LISTENING</p>
        <h1>Test not found.</h1>

        <Link to="/listening" className="primary-button">
          Back to Listening
        </Link>
      </div>
    );
  }

  const section = listeningTest.sections[activeSection];

  const allQuestions = listeningTest.sections.flatMap(
    (item) => item.questions,
  );

  const answeredCount = allQuestions.filter(
    (question) => answers[question.id],
  ).length;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const remaining = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remaining}`;
  };

  const updateAnswer = (
    question: ListeningQuestion,
    value: string,
  ) => {
    setAnswers((current) => ({
      ...current,
      [question.id]: value,
    }));
  };

  const playAudio = () => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      section.script,
    );

    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setPlaying(false);
    };

    utterance.onerror = () => {
      setPlaying(false);
    };

    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const submitTest = () => {
    stopAudio();

    navigate(
      `/listening/test/${testId}/results`,
      {
        state: {
          answers,
          autoSubmitted: false,
        },
      },
    );
  };

  const goToSection = (next: number) => {
    stopAudio();

    setActiveSection(
      Math.max(
        0,
        Math.min(
          listeningTest.sections.length - 1,
          next,
        ),
      ),
    );
  };

  return (
    <div className="listening-test-page">
      <header className="reading-test-header">
        <div>
          <Link to="/listening" className="reading-back-link">
            ← Listening Library
          </Link>

          <div className="reading-test-heading">
            <span>TEST {testId}</span>
            <h1>Academic Listening</h1>
          </div>
        </div>

        <div className="reading-test-actions">
          <div
            className={
              secondsLeft <= 300
                ? "reading-timer danger"
                : "reading-timer"
            }
          >
            <span>TIME</span>
            <strong>{formatTime(secondsLeft)}</strong>
          </div>

          <button
            className="reading-submit-button"
            type="button"
            onClick={() => setShowSubmit(true)}
          >
            Finish test
          </button>
        </div>
      </header>

      <div className="reading-test-progress">
        <div>
          <span
            style={{
              width: `${Math.min(
                100,
                (answeredCount / allQuestions.length) * 100,
              )}%`,
            }}
          />
        </div>

        <span>
          {answeredCount} / {allQuestions.length} answered
        </span>
      </div>

      <div className="listening-player-card dashboard-glass-card">
        <div className="listening-player-left">
          <div className="listening-player-icon">
            {playing ? "Ⅱ" : "▶"}
          </div>

          <div>
            <span className="dashboard-label">
              CURRENT AUDIO
            </span>

            <strong>
              Section {section.number} · {section.title}
            </strong>
          </div>
        </div>

        <div className="listening-player-controls">
          <button
            className="audio-control-button"
            type="button"
            onClick={playing ? stopAudio : playAudio}
          >
            {playing ? "Pause" : "Play audio"}
          </button>

          <label className="speech-speed">
            <span>Speed</span>

            <select
              value={speechRate}
              onChange={(event) =>
                setSpeechRate(Number(event.target.value))
              }
            >
              <option value={0.8}>0.8×</option>
              <option value={0.95}>0.95×</option>
              <option value={1}>1×</option>
            </select>
          </label>
        </div>
      </div>

      <div className="listening-test-layout">
        <aside className="listening-section-nav">
          <span className="dashboard-label">
            SECTIONS
          </span>

          {listeningTest.sections.map((item, index) => (
            <button
              type="button"
              key={item.number}
              className={
                activeSection === index
                  ? "listening-section-button active"
                  : "listening-section-button"
              }
              onClick={() => goToSection(index)}
            >
              <small>0{item.number}</small>

              <span>{item.title}</span>
            </button>
          ))}
        </aside>

        <section className="listening-question-panel">
          <div className="listening-question-header">
            <div>
              <span>SECTION {section.number}</span>
              <h2>{section.title}</h2>
            </div>

            <strong>
              {section.questions.length} questions
            </strong>
          </div>

          <div className="listening-question-list">
            {section.questions.map((question) => (
              <article
                className="listening-question"
                key={question.id}
              >
                <div className="question-number">
                  {question.id}
                </div>

                <div className="question-main">
                  <span className="question-type">
                    {question.type
                      .replaceAll("-", " ")
                      .toUpperCase()}
                  </span>

                  <h3>{question.question}</h3>

                  {question.options ? (
                    <div className="question-options">
                      {question.options.map((option) => (
                        <label
                          className={
                            answers[question.id] === option
                              ? "question-option selected"
                              : "question-option"
                          }
                          key={option}
                        >
                          <input
                            type="radio"
                            name={`listening-${question.id}`}
                            value={option}
                            checked={
                              answers[question.id] ===
                              option
                            }
                            onChange={() =>
                              updateAnswer(
                                question,
                                option,
                              )
                            }
                          />

                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      className="question-text-input"
                      type="text"
                      value={
                        answers[question.id] ?? ""
                      }
                      onChange={(event) =>
                        updateAnswer(
                          question,
                          event.target.value,
                        )
                      }
                      placeholder="Type your answer..."
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="reading-test-footer">
        <button
          className="reading-nav-button"
          type="button"
          disabled={activeSection === 0}
          onClick={() => goToSection(activeSection - 1)}
        >
          ← Previous section
        </button>

        {activeSection <
        listeningTest.sections.length - 1 ? (
          <button
            className="reading-nav-button primary"
            type="button"
            onClick={() => goToSection(activeSection + 1)}
          >
            Next section →
          </button>
        ) : (
          <button
            className="reading-nav-button primary"
            type="button"
            onClick={() => setShowSubmit(true)}
          >
            Finish test →
          </button>
        )}
      </footer>

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

            <h2>Finish your Listening test?</h2>

            <p>
              You have answered {answeredCount} of{" "}
              {allQuestions.length} questions.
            </p>

            <div className="reading-modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowSubmit(false)}
              >
                Continue
              </button>

              <button
                className="primary-button"
                type="button"
                onClick={submitTest}
              >
                Submit test
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeningTest;