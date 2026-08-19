import { useMemo, useState } from "react";

import {
  clearProgress,
  getAllSkillTrends,
  getAverageBand,
  getProgressAttempts,
  getProgressRecommendation,
  getWeakestSkill,
  type ProgressSkill,
} from "../lib/progress";

function Progress() {
  const [, forceUpdate] = useState(0);

  const attempts = useMemo(
    () => getProgressAttempts(),
    [],
  );

  const averageBand = getAverageBand();
  const weakestSkill = getWeakestSkill();
  const trends = getAllSkillTrends();
  const recommendation =
    getProgressRecommendation();

  const skillMeta: Record<
    ProgressSkill,
    {
      label: string;
      description: string;
    }
  > = {
    reading: {
      label: "Reading",
      description:
        "Accuracy and comprehension",
    },
    listening: {
      label: "Listening",
      description:
        "Accuracy and concentration",
    },
    writing: {
      label: "Writing",
      description:
        "AI-evaluated responses",
    },
    speaking: {
      label: "Speaking",
      description:
        "AI-evaluated interviews",
    },
  };

  const latest = (
    skill: ProgressSkill,
  ) =>
    attempts.find(
      (attempt) => attempt.skill === skill,
    );

  const refresh = () => {
    forceUpdate((value) => value + 1);
  };

  const resetProgress = () => {
    const confirmed = window.confirm(
      "Delete all saved SelfEDU progress?",
    );

    if (!confirmed) {
      return;
    }

    clearProgress();
    refresh();
  };

  const formatTrend = (
    skill: ProgressSkill,
  ) => {
    const trend = trends[skill];

    if (trend.change === null) {
      return "—";
    }

    return `${trend.change > 0 ? "+" : ""}${trend.change.toFixed(1)}`;
  };

  const formatTrendLabel = (
    skill: ProgressSkill,
  ) => {
    const status = trends[skill].status;

    if (status === "improving") {
      return "Improving";
    }

    if (status === "declining") {
      return "Declining";
    }

    if (status === "stable") {
      return "Stable";
    }

    return "Not enough data";
  };

  return (
    <div className="progress-page">
      <section className="progress-hero">
        <div>
          <p className="eyebrow">
            YOUR PERFORMANCE
          </p>

          <h1>
            Progress you
            <br />
            <span>can actually see.</span>
          </h1>

          <p className="progress-hero-description">
            SelfEDU collects your completed Reading,
            Listening, Writing, and Speaking attempts so
            your dashboard reflects what you actually
            practiced.
          </p>
        </div>

        <div className="progress-band-orb">
          <span>OVERALL BAND</span>

          <strong>
            {averageBand !== null
              ? averageBand.toFixed(1)
              : "—"}
          </strong>

          <small>
            {attempts.length
              ? "based on saved attempts"
              : "complete a skill to begin"}
          </small>
        </div>
      </section>

      <section className="progress-skill-grid">
        {(
          [
            "reading",
            "listening",
            "writing",
            "speaking",
          ] as ProgressSkill[]
        ).map((skill) => {
          const item = latest(skill);
          const trend = trends[skill];

          return (
            <article
              className="progress-skill-card dashboard-glass-card"
              key={skill}
            >
              <div className="progress-skill-top">
                <span>
                  {skillMeta[skill].label}
                </span>

                <span>
                  {item?.band !== undefined
                    ? item.band.toFixed(1)
                    : "—"}
                </span>
              </div>

              <h2>
                {item?.band !== undefined
                  ? `Band ${item.band.toFixed(1)}`
                  : "Not attempted"}
              </h2>

              <p>
                {item?.detail ||
                  skillMeta[skill].description}
              </p>

              <div className="progress-skill-footer">
                <span>
                  {item
                    ? new Date(
                        item.date,
                      ).toLocaleDateString()
                    : "No attempt yet"}
                </span>

                <strong>
                  {formatTrend(skill)} ·{" "}
                  {formatTrendLabel(skill)}
                </strong>
              </div>

              {trend.attempts > 0 && (
                <div
                  style={{
                    marginTop: "14px",
                    color: "var(--text-muted)",
                    fontSize: "9px",
                  }}
                >
                  {trend.attempts} recorded{" "}
                  {trend.attempts === 1
                    ? "attempt"
                    : "attempts"}
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="progress-analysis">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">
              NEXT MOVE
            </p>

            <h2>
              What should you work on?
            </h2>
          </div>
        </div>

        <div className="progress-analysis-grid">
          <article className="progress-focus-card dashboard-glass-card">
            <span className="dashboard-label">
              WEAKEST CURRENT SKILL
            </span>

            <strong>
              {weakestSkill
                ? skillMeta[
                    weakestSkill.skill
                  ].label
                : "Not enough data"}
            </strong>

            <p>
              {weakestSkill
                ? `Your latest saved estimate is Band ${weakestSkill.band.toFixed(
                    1,
                  )}.`
                : "Complete at least one evaluated attempt to generate a meaningful recommendation."}
            </p>
          </article>

          <article className="progress-focus-card dashboard-glass-card">
            <span className="dashboard-label">
              TOTAL ATTEMPTS
            </span>

            <strong>
              {attempts.length}
            </strong>

            <p>
              Every completed skill attempt is saved
              locally in this browser.
            </p>
          </article>

          <article className="progress-focus-card dashboard-glass-card">
            <span className="dashboard-label">
              NEXT RECOMMENDATION
            </span>

            <strong>
              {recommendation.skill
                ? skillMeta[
                    recommendation.skill
                  ].label
                : "Start"}
            </strong>

            <p>
              {recommendation.description}
            </p>
          </article>
        </div>
      </section>

      <section className="progress-history">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">
              RECENT ACTIVITY
            </p>

            <h2>
              Your latest attempts.
            </h2>
          </div>

          <button
            type="button"
            className="progress-reset-button"
            onClick={resetProgress}
          >
            Reset local progress
          </button>
        </div>

        {attempts.length === 0 ? (
          <div className="progress-empty dashboard-glass-card">
            <span className="dashboard-label">
              NOTHING HERE YET
            </span>

            <h3>
              Complete a Reading, Listening, Writing,
              or Speaking task.
            </h3>

            <p>
              Your results will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="progress-history-list">
            {attempts.map((attempt) => (
              <article
                className="progress-history-row dashboard-glass-card"
                key={attempt.id}
              >
                <div>
                  <span className="progress-history-skill">
                    {skillMeta[
                      attempt.skill
                    ].label.toUpperCase()}
                  </span>

                  <strong>
                    {attempt.title}
                  </strong>
                </div>

                <div className="progress-history-score">
                  <strong>
                    {typeof attempt.band ===
                    "number"
                      ? attempt.band.toFixed(1)
                      : "—"}
                  </strong>

                  <span>
                    {attempt.score}
                    {attempt.maxScore
                      ? ` / ${attempt.maxScore}`
                      : ""}
                  </span>
                </div>

                <time>
                  {new Date(
                    attempt.date,
                  ).toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Progress;