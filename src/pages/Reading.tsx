import { Link } from "react-router-dom";
import { readingBooks } from "../data/readingData";

function Reading() {
  return (
    <div className="reading-library-page">
      <section className="reading-library-hero">
        <div>
          <p className="eyebrow">IELTS ACADEMIC READING</p>

          <h1>
            Build your
            <br />
            <span>reading edge.</span>
          </h1>

          <p className="reading-library-description">
            Work through a structured library of IELTS Academic practice,
            track your performance, and return to the question types that
            need the most attention.
          </p>

          <div className="reading-library-stats">
            <div>
              <strong>21</strong>
              <span>Books</span>
            </div>

            <div>
              <strong>84</strong>
              <span>Test sessions</span>
            </div>

            <div>
              <strong>60</strong>
              <span>Minutes</span>
            </div>
          </div>
        </div>

        <div className="reading-hero-visual">
          <div className="reading-orbit reading-orbit-a" />
          <div className="reading-orbit reading-orbit-b" />

          <div className="reading-book-object">
            <span>READ</span>
            <strong>IELTS</strong>
            <small>ACADEMIC</small>
          </div>
        </div>
      </section>

      <section className="reading-library-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">READING LIBRARY</p>
            <h2>Choose your book.</h2>
          </div>

          <span className="dashboard-muted">
            Academic Reading · Practice library
          </span>
        </div>

        <div className="reading-books-grid">
          {readingBooks.map((book) => (
            <Link
              key={book.id}
              to={`/reading/cambridge/${book.id}`}
              className="reading-book-card dashboard-glass-card"
            >
              <div className="reading-book-top">
                <span>CAMBRIDGE</span>
                <span>21 BOOKS</span>
              </div>

              <div className="reading-book-number">
                {book.id}
              </div>

              <div className="reading-book-bottom">
                <div>
                  <strong>{book.title}</strong>
                  <span>{book.subtitle}</span>
                </div>

                <span className="reading-arrow">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Reading;