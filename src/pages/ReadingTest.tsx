import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getReadingTest,
  type ReadingQuestion,
} from "../data/readingData";

type AnswerMap = Record<number, string>;

function ReadingTest() {
  const { bookId, testNumber } = useParams();
  const navigate = useNavigate();

  const book = Number(bookId);
  const test = Number(testNumber);

  const readingTest = useMemo(
    () => getReadingTest(book, test),
    [book, test],
  );

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [activePassage, setActivePassage] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    if (!readingTest) {
      return;
    }

    const saved = localStorage.getItem(
      `selfedu-reading-${readingTest.id}`,
    );

    if (saved) {
      try {
        setAnswers(JSON.parse(saved) as AnswerMap);
      } catch {
        localStorage.removeItem(
          `selfedu-reading-${readingTest.id}`,
        );
      }
    }
  }, [readingTest]);

  useEffect(() => {
    if (!readingTest) {
      return;
    }

    localStorage.setItem(
      `selfedu-reading-${readingTest.id}`,
      JSON.stringify(answers),
    );
  }, [answers, readingTest]);

  useEffect(() => {
    if (!readingTest) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          navigate(
            `/reading/cambridge/${book}/test/${test}/results`,
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
  }, [answers, book, navigate, readingTest, test]);

  if (!readingTest) {
    return (
      <div className="reading-error-page">
        <p className="eyebrow">READING TEST</p>
        <h1>Test not found.</h1>
        <Link to="/reading" className="primary-button">
          Back to Reading
        </Link>
      </div>
    );
  }

  const passage = readingTest.passages[activePassage];

  const allQuestions = readingTest.passages.flatMap(
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
    question: ReadingQuestion,
    value: string,
  ) => {
    setAnswers((current) => ({
      ...current,
      [question.id]: value,
    }));
  };

  const submitTest = () => {
    navigate(
      `/reading/cambridge/${book}/test/${test}/results`,
      {
        state: {
          answers,
          autoSubmitted: false,
        },
      },
    );
  };

  return (
    <div className="reading-test-page">
      <header className="reading-test-header">
        <div>
          <Link
            to={`/reading/cambridge/${book}`}
            className="reading-back-link"
          >
            ← {`Cambridge ${book}`}
          </Link>

          <div className="reading-test-heading">
            <span>TEST {test}</span>
            <h1>Academic Reading</h1>
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

      <div className="reading-test-layout">
        <aside className="reading-passage-nav">
          <span className="dashboard-label">
            PASSAGES
          </span>

          {readingTest.passages.map((item, index) => (
            <button
              className={
                activePassage === index
                  ? "passage-nav-button active"
                  : "passage-nav-button"
              }
              key={item.title}
              type="button"
              onClick={() => setActivePassage(index)}
            >
              <small>0{index + 1}</small>
              <span>Passage {index + 1}</span>
            </button>
          ))}

          <div className="reading-test-mini-summary">
            <span>Questions</span>
            <strong>{passage.questions.length}</strong>
          </div>
        </aside>

        <section className="reading-passage">
          <div className="reading-passage-header">
            <span>
              PASSAGE {activePassage + 1}
            </span>

            <h2>{passage.title}</h2>
          </div>

          <div className="reading-passage-copy">
            {passage.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="reading-questions">
          <div className="reading-question-header">
            <span>
              QUESTIONS {activePassage * 6 + 1}–
              {activePassage * 6 + passage.questions.length}
            </span>

            <strong>
              {activePassage + 1} /{" "}
              {readingTest.passages.length}
            </strong>
          </div>

          <div className="reading-question-list">
            {passage.questions.map((question) => (
              <article
                className="reading-question"
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
                            name={`question-${question.id}`}
                            value={option}
                            checked={
                              answers[question.id] === option
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
                      value={answers[question.id] ?? ""}
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
          disabled={activePassage === 0}
          onClick={() =>
            setActivePassage((current) =>
              Math.max(0, current - 1),
            )
          }
        >
          ← Previous passage
        </button>

        {activePassage < readingTest.passages.length - 1 ? (
          <button
            className="reading-nav-button primary"
            type="button"
            onClick={() =>
              setActivePassage((current) =>
                Math.min(
                  readingTest.passages.length - 1,
                  current + 1,
                ),
              )
            }
          >
            Next passage →
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

            <h2>Finish your Reading test?</h2>

            <p>
              You have answered {answeredCount} of{" "}
              {allQuestions.length} questions.
              Unanswered questions will be counted as incorrect.
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

export default ReadingTest;