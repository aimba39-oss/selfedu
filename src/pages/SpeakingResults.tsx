import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { saveProgressAttempt } from "../lib/progress";
import { apiUrl } from "../lib/api";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface SpeakingResultState {
  completed?: boolean;
  conversation?: ConversationMessage[];
}

interface SpeakingEvaluation {
  estimatedBand: number;
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

interface SpeakingApiResponse {
  ok: boolean;
  evaluation?: SpeakingEvaluation;
  error?: string;
}

function SpeakingResults() {
  const location = useLocation();

  const state =
    (location.state as SpeakingResultState | null) ?? null;

  const conversation =
    state?.conversation ?? [];

  const [evaluation, setEvaluation] =
    useState<SpeakingEvaluation | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const studentTurns = useMemo(
    () =>
      conversation.filter(
        (item) => item.role === "user",
      ),
    [conversation],
  );

  useEffect(() => {
    if (conversation.length === 0) {
      setLoading(false);
      setError(
        "No speaking conversation was found.",
      );
      return;
    }

    let cancelled = false;

    const evaluateSpeaking = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          apiUrl("/api/ai/speaking-evaluate"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              conversation,
              part: 3,
            }),
          },
        );

        const data =
          (await response.json()) as SpeakingApiResponse;

        if (!response.ok || !data.evaluation) {
          throw new Error(
            data.error ||
              "Speaking evaluation failed.",
          );
        }

        if (!cancelled) {
          setEvaluation(data.evaluation);
        }
      } catch (requestError) {
        console.error(
          "Speaking evaluation error:",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Gemini could not evaluate this speaking session right now.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void evaluateSpeaking();

    return () => {
      cancelled = true;
    };
  }, [conversation]);

  useEffect(() => {
    if (!evaluation) {
      return;
    }

    saveProgressAttempt({
      id: `speaking-${Date.now()}`,
      skill: "speaking",
      score: evaluation.estimatedBand,
      band: evaluation.estimatedBand,
      title: "AI Speaking Interview",
      date: new Date().toISOString(),
      detail: "Gemini speaking evaluation",
    });
  }, [evaluation]);

  return (
    <div className="speaking-results-page">
      <section className="speaking-results-hero">
        <div>
          <Link
            to="/speaking"
            className="reading-back-link"
          >
            ← Speaking
          </Link>

          <p className="eyebrow">
            GEMINI SPEAKING EVALUATION
          </p>

          <h1>
            Your interview.
            <br />
            <span>Now analyzed.</span>
          </h1>

          <p>
            {loading
              ? "Gemini is analyzing your speaking performance."
              : evaluation
                ? "Your AI learning evaluation is ready."
                : "The evaluation could not be completed."}
          </p>
        </div>

        <div className="speaking-result-band">
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
        <section className="speaking-ai-loading dashboard-glass-card">
          <div className="speaking-loading-orb">
            ✦
          </div>

          <div>
            <span className="dashboard-label">
              GEMINI IS ANALYZING
            </span>

            <h2>
              Reviewing your speaking...
            </h2>

            <p>
              Checking fluency, vocabulary, grammar,
              and the development of your answers.
            </p>
          </div>
        </section>
      )}

      {error && !loading && (
        <section className="speaking-ai-error dashboard-glass-card">
          <span className="dashboard-label">
            EVALUATION UNAVAILABLE
          </span>

          <h2>
            We couldn't evaluate this interview.
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
          <section className="speaking-criteria-grid">
            <article className="speaking-criterion-card dashboard-glass-card">
              <span>
                Fluency &amp; Coherence
              </span>

              <strong>
                {evaluation.fluencyScore}
              </strong>

              <p>
                Flow, organization, hesitation,
                and development of ideas.
              </p>
            </article>

            <article className="speaking-criterion-card dashboard-glass-card">
              <span>
                Lexical Resource
              </span>

              <strong>
                {evaluation.vocabularyScore}
              </strong>

              <p>
                Vocabulary range, precision,
                and flexibility.
              </p>
            </article>

            <article className="speaking-criterion-card dashboard-glass-card">
              <span>Grammar</span>

              <strong>
                {evaluation.grammarScore}
              </strong>

              <p>
                Accuracy and range of grammatical
                structures.
              </p>
            </article>

            <article className="speaking-criterion-card dashboard-glass-card">
              <span>
                Pronunciation
              </span>

              <strong>
                {evaluation.pronunciationScore}
              </strong>

              <p>
                Transcript-based estimate only.
                Audio analysis will come later.
              </p>
            </article>
          </section>

          <section className="speaking-ai-summary dashboard-glass-card">
            <span className="dashboard-label">
              GEMINI SUMMARY
            </span>

            <h2>
              How your speaking performed.
            </h2>

            <p>
              {evaluation.summary}
            </p>
          </section>

          <section className="speaking-feedback-columns">
            <article className="speaking-feedback-card dashboard-glass-card">
              <span className="dashboard-label">
                WHAT YOU DID WELL
              </span>

              <div className="speaking-feedback-list">
                {evaluation.strengths.map(
                  (item, index) => (
                    <div
                      key={`${item}-${index}`}
                    >
                      <span>+</span>
                      <p>{item}</p>
                    </div>
                  ),
                )}
              </div>
            </article>

            <article className="speaking-feedback-card dashboard-glass-card">
              <span className="dashboard-label">
                WHAT NEEDS WORK
              </span>

              <div className="speaking-feedback-list">
                {evaluation.weaknesses.map(
                  (item, index) => (
                    <div
                      key={`${item}-${index}`}
                    >
                      <span>!</span>
                      <p>{item}</p>
                    </div>
                  ),
                )}
              </div>
            </article>
          </section>

          <section className="speaking-improvement">
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

            <div className="speaking-insight-grid">
              {evaluation.improvements.map(
                (item, index) => (
                  <article
                    className="speaking-insight-card dashboard-glass-card"
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
              )}
            </div>
          </section>
        </>
      )}

      <section className="speaking-transcript-review">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">
              INTERVIEW TRANSCRIPT
            </p>

            <h2>
              What you actually said.
            </h2>
          </div>

          <span className="dashboard-muted">
            {studentTurns.length} responses
          </span>
        </div>

        <div className="speaking-transcript-review-list">
          {studentTurns.map(
            (message, index) => (
              <article
                className="speaking-transcript-review-card dashboard-glass-card"
                key={`${message.content}-${index}`}
              >
                <span>
                  RESPONSE{" "}
                  {String(index + 1).padStart(
                    2,
                    "0",
                  )}
                </span>

                <p>
                  {message.content}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="speaking-results-cta">
        <p className="eyebrow">
          KEEP PRACTICING
        </p>

        <h2>
          Speak again.
          <br />
          <span>Improve again.</span>
        </h2>

        <div>
          <Link
            className="primary-button"
            to="/speaking/interview?part=1"
          >
            Start another interview
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

export default SpeakingResults;