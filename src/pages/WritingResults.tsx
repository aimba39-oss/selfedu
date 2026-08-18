import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";

import { getWritingTask } from "../data/writingData";
import { saveProgressAttempt } from "../lib/progress";
import { apiUrl } from "../lib/api";

interface WritingResultState {
  answer?: string;
  autoSubmitted?: boolean;
}

interface WritingExample {
  original: string;
  improved: string;
  explanation: string;
}

interface WritingEvaluation {
  estimatedBand: number;
  taskScore: number;
  coherenceScore: number;
  lexicalScore: number;
  grammarScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  examples: WritingExample[];
}

interface WritingApiResponse {
  ok: boolean;
  model?: string;
  evaluation?: WritingEvaluation;
  error?: string;
}

function WritingResults() {
  const { taskId } = useParams();
  const location = useLocation();

  const task = taskId
    ? getWritingTask(taskId)
    : undefined;

  const state =
    (location.state as WritingResultState | null) ?? null;

  const answer = state?.answer ?? "";

  const wordCount = answer.trim()
    ? answer.trim().split(/\s+/).length
    : 0;

  const [evaluation, setEvaluation] =
    useState<WritingEvaluation | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!task || !answer.trim()) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const evaluateWriting = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          apiUrl("/api/ai/writing-evaluate"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              taskType: task.type,
              prompt: task.prompt,
              answer,
              wordCount,
            }),
          },
        );

        const data =
          (await response.json()) as WritingApiResponse;

        if (!response.ok || !data.evaluation) {
          throw new Error(
            data.error ||
              "Writing evaluation failed.",
          );
        }

        if (!cancelled) {
          setEvaluation(data.evaluation);
        }
      } catch (requestError) {
        console.error(
          "Writing evaluation error:",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Gemini could not evaluate this response right now.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void evaluateWriting();

    return () => {
      cancelled = true;
    };
  }, [answer, task, wordCount]);

  useEffect(() => {
    if (!evaluation || !taskId || !task) {
      return;
    }

    saveProgressAttempt({
      id: `writing-${taskId}-${Date.now()}`,
      skill: "writing",
      score: evaluation.estimatedBand,
      band: evaluation.estimatedBand,
      title: task.title,
      date: new Date().toISOString(),
      detail: `Gemini evaluation · ${wordCount} words`,
    });
  }, [
    evaluation,
    task,
    taskId,
    wordCount,
  ]);

  if (!task) {
    return (
      <div className="reading-error-page">
        <p className="eyebrow">RESULTS</p>

        <h1>Writing task not found.</h1>

        <Link
          to="/writing"
          className="primary-button"
        >
          Back to Writing
        </Link>
      </div>
    );
  }

  return (
    <div className="writing-results-page">
      <section className="writing-results-hero">
        <div>
          <Link
            to="/writing"
            className="reading-back-link"
          >
            ← Writing
          </Link>

          <p className="eyebrow">
            GEMINI WRITING EVALUATION
          </p>

          <h1>
            Your response.
            <br />
            <span>Now analyzed.</span>
          </h1>

          <p>
            {state?.autoSubmitted
              ? "Your response was submitted automatically when the timer ended."
              : "Gemini has analyzed your writing response."}
          </p>
        </div>

        <div className="writing-overall-band">
          <span>AI ESTIMATED BAND</span>

          <strong>
            {loading
              ? "—"
              : evaluation?.estimatedBand ?? "—"}
          </strong>

          <small>
            Learning estimate
          </small>
        </div>
      </section>

      {loading && (
        <section className="writing-ai-loading dashboard-glass-card">
          <div className="writing-loading-orb">
            ✦
          </div>

          <div>
            <span className="dashboard-label">
              GEMINI IS ANALYZING
            </span>

            <h2>
              Reading your response...
            </h2>

            <p>
              Checking task fulfillment,
              organization, vocabulary, grammar,
              and sentence-level improvements.
            </p>
          </div>
        </section>
      )}

      {error && !loading && (
        <section className="writing-ai-error dashboard-glass-card">
          <span className="dashboard-label">
            EVALUATION UNAVAILABLE
          </span>

          <h2>
            We couldn't evaluate this response.
          </h2>

          <p>{error}</p>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try again
            <span>↻</span>
          </button>
        </section>
      )}

      {evaluation && !loading && (
        <>
          <section className="writing-result-grid">
            <div className="writing-result-main dashboard-glass-card">
              <div className="writing-result-header">
                <div>
                  <span className="dashboard-label">
                    AI EVALUATION
                  </span>

                  <h2>{task.title}</h2>
                </div>

                <div className="writing-result-wordcount">
                  <strong>{wordCount}</strong>
                  <span>words</span>
                </div>
              </div>

              <div className="writing-ai-notice">
                <span>GEMINI ANALYSIS</span>

                <p>{evaluation.summary}</p>
              </div>

              <div className="writing-criteria-grid">
                <article className="writing-criterion">
                  <span>Task Response</span>

                  <strong>
                    {evaluation.taskScore}
                  </strong>

                  <p>
                    How effectively the response
                    addresses the task and develops
                    its ideas.
                  </p>
                </article>

                <article className="writing-criterion">
                  <span>
                    Coherence &amp; Cohesion
                  </span>

                  <strong>
                    {evaluation.coherenceScore}
                  </strong>

                  <p>
                    Organization, progression,
                    paragraphing, and linking.
                  </p>
                </article>

                <article className="writing-criterion">
                  <span>
                    Lexical Resource
                  </span>

                  <strong>
                    {evaluation.lexicalScore}
                  </strong>

                  <p>
                    Range, precision, and appropriate
                    vocabulary.
                  </p>
                </article>

                <article className="writing-criterion">
                  <span>Grammar</span>

                  <strong>
                    {evaluation.grammarScore}
                  </strong>

                  <p>
                    Range and accuracy of grammatical
                    structures.
                  </p>
                </article>
              </div>
            </div>

            <aside className="writing-response-preview dashboard-glass-card">
              <span className="dashboard-label">
                YOUR RESPONSE
              </span>

              <div className="writing-response-text">
                {answer ? (
                  answer
                ) : (
                  <span>
                    No response was submitted.
                  </span>
                )}
              </div>
            </aside>
          </section>

          <section className="writing-feedback-columns">
            <article className="writing-feedback-card dashboard-glass-card">
              <span className="dashboard-label">
                WHAT YOU DID WELL
              </span>

              <div className="writing-feedback-list">
                {evaluation.strengths.length > 0 ? (
                  evaluation.strengths.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                      >
                        <span>+</span>
                        <p>{item}</p>
                      </div>
                    ),
                  )
                ) : (
                  <p className="writing-empty-feedback">
                    No strengths were returned.
                  </p>
                )}
              </div>
            </article>

            <article className="writing-feedback-card dashboard-glass-card">
              <span className="dashboard-label">
                WHAT NEEDS WORK
              </span>

              <div className="writing-feedback-list">
                {evaluation.weaknesses.length > 0 ? (
                  evaluation.weaknesses.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                      >
                        <span>!</span>
                        <p>{item}</p>
                      </div>
                    ),
                  )
                ) : (
                  <p className="writing-empty-feedback">
                    No weaknesses were returned.
                  </p>
                )}
              </div>
            </article>
          </section>

          <section className="writing-improvement-section">
            <div className="dashboard-section-heading">
              <div>
                <p className="eyebrow">
                  GEMINI COACHING
                </p>

                <h2>
                  Your next improvements.
                </h2>
              </div>
            </div>

            <div className="writing-improvement-grid">
              {evaluation.improvements.length > 0 ? (
                evaluation.improvements.map(
                  (item, index) => (
                    <article
                      className="writing-improvement-card dashboard-glass-card"
                      key={`${item}-${index}`}
                    >
                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <h3>Focus area</h3>

                      <p>{item}</p>
                    </article>
                  ),
                )
              ) : (
                <div className="writing-empty-feedback">
                  No improvement plan was returned.
                </div>
              )}
            </div>
          </section>

          {evaluation.examples.length > 0 && (
            <section className="writing-examples-section">
              <div className="dashboard-section-heading">
                <div>
                  <p className="eyebrow">
                    SENTENCE-LEVEL COACHING
                  </p>

                  <h2>
                    Make your writing stronger.
                  </h2>
                </div>
              </div>

              <div className="writing-examples-list">
                {evaluation.examples.map(
                  (example, index) => (
                    <article
                      className="writing-example-card dashboard-glass-card"
                      key={`${example.original}-${index}`}
                    >
                      <div className="writing-example-number">
                        0{index + 1}
                      </div>

                      <div>
                        <span>ORIGINAL</span>

                        <p className="writing-example-original">
                          {example.original}
                        </p>

                        <span>IMPROVED</span>

                        <p className="writing-example-improved">
                          {example.improved}
                        </p>

                        <span>WHY</span>

                        <p className="writing-example-explanation">
                          {example.explanation}
                        </p>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </section>
          )}
        </>
      )}

      <section className="writing-results-cta">
        <p className="eyebrow">
          KEEP BUILDING
        </p>

        <h2>
          One response.
          <br />
          <span>
            Then another improvement.
          </span>
        </h2>

        <div>
          <Link
            className="primary-button"
            to="/writing"
          >
            Write another response
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

export default WritingResults;