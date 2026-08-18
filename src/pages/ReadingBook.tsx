import { Link, useParams } from "react-router-dom";

import {
  getReadingBook,
} from "../data/readingData";

function ReadingBook() {
  const { bookId } = useParams();

  const book = getReadingBook(Number(bookId));

  if (!book) {
    return (
      <div className="reading-error-page">
        <p className="eyebrow">READING LIBRARY</p>
        <h1>Book not found.</h1>
        <Link to="/reading" className="primary-button">
          Back to Reading
        </Link>
      </div>
    );
  }

  return (
    <div className="reading-book-page">
      <section className="reading-book-header">
        <div>
          <Link
            to="/reading"
            className="reading-back-link"
          >
            ← Reading Library
          </Link>

          <p className="eyebrow">
            IELTS ACADEMIC READING
          </p>

          <h1>{book.title}</h1>

          <p>
            Four structured practice sessions.
            Choose a test and begin when you're ready.
          </p>
        </div>

        <div className="reading-book-badge">
          <span>BOOK</span>
          <strong>{book.id}</strong>
        </div>
      </section>

      <section className="reading-tests-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">TESTS</p>
            <h2>Choose your test.</h2>
          </div>
        </div>

        <div className="reading-tests-grid">
          {book.tests.map((test) => (
            <Link
              key={test.id}
              to={`/reading/cambridge/${book.id}/test/${test.testNumber}`}
              className="reading-test-card dashboard-glass-card"
            >
              <div className="reading-test-number">
                0{test.testNumber}
              </div>

              <div className="reading-test-content">
                <span>{test.difficulty}</span>
                <h3>{test.title}</h3>
                <p>
                  {test.passages.length} passages ·{" "}
                  {test.estimatedMinutes} min
                </p>
              </div>

              <div className="reading-test-arrow">↗</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ReadingBook;