import { useEffect, useMemo } from "react";
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

/**
 * Approximate IELTS Academic Reading conversion.
 *
 * IELTS/Cambridge conversions can vary slightly by test,
 * so this is intentionally treated as an estimate.
 */
function getReadingBand(correct: number): number | null {
  if (correct <= 0) {
    return null;
  }

  if (correct >= 39) {
    return 9.0;
  }

  if (correct >= 37) {
    return 8.5;
  }

  if (correct >= 35) {
    return 8.0;
  }

  if (correct >= 33) {
    return 7.5;
  }

  if (correct >= 30) {
    return 7.0;
  }

  if (correct >= 27) {
    return 6.5;
  }

  if (correct >= 23) {
    return 6.0;
  }

  if (correct >= 19) {
    return 5.5;
  }

  if (correct >= 15) {
    return 5.0;
  }

  if (correct >= 13) {
    return 4.5;
  }

  if (correct >= 10) {
    return 4.0;
  }

  if (correct >= 8) {
    return 3.5;
  }

  if (correct >= 6) {
    return 3.0;
  }

  if (correct >= 4) {
    return 2.5;
  }

  if (correct >= 2) {
    return 2.0;
  }

  return 1.0;
}

function ReadingResults() {
  const { bookId, testNumber } = useParams();
  const location = useLocation();

  const book = Number(bookId);
  const test = Number(testNumber);

  const readingTest = getReadingTest(book, test);

  const state =
    (location.state as ResultsLocationState | null) ??
    null;

  const answers = state?.answers ?? {};

  const questions = useMemo(
    () =>
      readingTest
        ? readingTest.passages.flatMap(
            (passage) => passage.questions,
          )
        : [],
    [readingTest],
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

  const band = getReadingBand(correct);

  useEffect(() => {
    if (!readingTest || total === 0) {
      return;
    }

    saveProgressAttempt({
      id: `reading-${book}-${test}-${Date.now()}`,
      skill: "reading",
      score: correct,
      maxScore: total,
      band: band ?? undefined,
      title: `Cambridge ${book} · Test ${test}`,
      date: new Date().toISOString(),
      detail: `${correct}/${total} correct · ${percentage}% accuracy`,
    });
  }, [
    band,
    book,
    correct,
    percentage,
    readingTest,
    test,
    total,
  ]);

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

          <strong>
            {band !== null
              ? band.toFixed(1)
              : "—"}
          </strong>

          <small>
            {percentage}% accuracy
          </small>
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