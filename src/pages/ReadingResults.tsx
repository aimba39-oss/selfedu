import { useEffect } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";

import { getReadingTest } from "../data/readingData";
import { saveProgressAttempt } from "../lib/progress";

interface ResultsLocationState {
  answers?: Record<number, string>;
  autoSubmitted?: boolean;
}

function ReadingResults() {
  const { bookId, testNumber } = useParams();
  const location = useLocation();

  const book = Number(bookId);
  const test = Number(testNumber);

  const readingTest = getReadingTest(book, test);

  const state =
    (location.state as ResultsLocationState | null) ?? null;

  const answers = state?.answers ?? {};

  if (!readingTest) {
    return (
      <div className="reading-error-page">
        <p className="eyebrow">RESULTS</p>

        <h1>Results not found.</h1>

        <Link
          to="/reading"
          className="primary-button"
        >
          Back to Reading
        </Link>
      </div>
    );
  }

  const questions = readingTest.passages.flatMap(
    (passage) => passage.questions,
  );

  const correct = questions.filter(
    (question) =>
      (answers[question.id] ?? "")
        .trim()
        .toLowerCase() ===
      question.answer.trim().toLowerCase(),
  ).length;

  const total = questions.length;

  const percentage =
    total === 0
      ? 0
      : Math.round((correct / total) * 100);

  const band =
    correct >= Math.ceil(total * 0.9)
      ? "8.5"
      : correct >= Math.ceil(total * 0.78)
        ? "8.0"
        : correct >= Math.ceil(total * 0.68)
          ? "7.5"
          : correct >= Math.ceil(total * 0.58)
            ? "7.0"
            : correct >= Math.ceil(total * 0.48)
              ? "6.5"
              : "6.0";

  useEffect(() => {
    saveProgressAttempt({
      id: `reading-${book}-${test}-${Date.now()}`,
      skill: "reading",
      score: correct,
      maxScore: total,
      band: Number(band),
      title: `Cambridge ${book} · Test ${test}`,
      date: new Date().toISOString(),
      detail: `${correct}/${total} correct · ${percentage}% accuracy`,
    });
  }, [
    band,
    book,
    correct,
    percentage,
    test,
    total,
  ]);

  return (
    <div className="reading-results-page">
      <section className="reading-results-hero">
        <div>
          <Link
            to={`/reading/cambridge/${book}`}
            className="reading-back-link"
          >
            ← Cambridge {book}
          </Link>

          <p className="eyebrow">
            READING RESULTS
          </p>

          <h1>
            Test {test}
            <br />
            <span>completed.</span>
          </h1>

          <p>
            {state?.autoSubmitted
              ? "Your time reached zero, so the test was submitted automatically."
              : "Your Reading practice has been submitted."}
          </p>
        </div>

        <div className="reading-result-band">
          <span>ESTIMATED BAND</span>

          <strong>{band}</strong>

          <small>{percentage}% accuracy</small>
        </div>
      </section>

      <section className="reading-results-summary">
        <article className="results-summary-card dashboard-glass-card">
          <span className="dashboard-label">
            CORRECT
          </span>

          <strong>
            {correct}
            <small>/{total}</small>
          </strong>

          <p>
            Questions answered correctly
          </p>
        </article>

        <article className="results-summary-card dashboard-glass-card">
          <span className="dashboard-label">
            ACCURACY
          </span>

          <strong>{percentage}%</strong>

          <p>
            Overall answer accuracy
          </p>
        </article>

        <article className="results-summary-card dashboard-glass-card">
          <span className="dashboard-label">
            NEXT STEP
          </span>

          <strong>Review</strong>

          <p>
            Understand every mistake before your next test.
          </p>
        </article>
      </section>

      <section className="reading-review-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">
              ANSWER REVIEW
            </p>

            <h2>What happened?</h2>
          </div>

          <Link
            to="/reading"
            className="dashboard-inline-link"
          >
            Back to library
            <span>→</span>
          </Link>
        </div>

        <div className="reading-review-list">
          {questions.map((question) => {
            const userAnswer =
              answers[question.id] ?? "";

            const isCorrect =
              userAnswer
                .trim()
                .toLowerCase() ===
              question.answer
                .trim()
                .toLowerCase();

            return (
              <article
                className={
                  isCorrect
                    ? "reading-review-item correct"
                    : "reading-review-item incorrect"
                }
                key={question.id}
              >
                <div className="review-number">
                  {question.id}
                </div>

                <div className="review-question">
                  <span>
                    {question.type.replaceAll(
                      "-",
                      " ",
                    )}
                  </span>

                  <strong>
                    {question.question}
                  </strong>
                </div>

                <div className="review-answer">
                  <small>Your answer</small>

                  <strong>
                    {userAnswer ||
                      "Not answered"}
                  </strong>
                </div>

                <div className="review-correct-answer">
                  <small>Correct answer</small>

                  <strong>
                    {question.answer}
                  </strong>
                </div>

                <div className="review-status">
                  {isCorrect ? "✓" : "×"}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="reading-results-cta">
        <p className="eyebrow">
          KEEP GOING
        </p>

        <h2>
          One test is information.
          <br />
          <span>
            Consistency creates progress.
          </span>
        </h2>

        <div>
          <Link
            className="primary-button"
            to="/reading"
          >
            Choose another test
            <span>↗</span>
          </Link>

          <Link
            className="secondary-button"
            to="/progress"
          >
            View progress
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ReadingResults;