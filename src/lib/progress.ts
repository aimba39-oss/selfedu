export type ProgressSkill =
  | "reading"
  | "listening"
  | "writing"
  | "speaking";

export interface ProgressAttempt {
  id: string;
  skill: ProgressSkill;
  score: number;
  maxScore?: number;
  band?: number;
  title: string;
  date: string;
  detail?: string;
}

const STORAGE_KEY = "selfedu-progress";

export function getProgressAttempts(): ProgressAttempt[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveProgressAttempt(
  attempt: ProgressAttempt,
) {
  const current = getProgressAttempts();

  const next = [
    attempt,
    ...current.filter(
      (item) => item.id !== attempt.id,
    ),
  ].slice(0, 100);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(next),
  );
}

export function getSkillAttempts(
  skill: ProgressSkill,
) {
  return getProgressAttempts().filter(
    (attempt) => attempt.skill === skill,
  );
}

export function getLatestSkillAttempt(
  skill: ProgressSkill,
) {
  return getSkillAttempts(skill)[0] ?? null;
}

export function getAverageBand() {
  const bands = getProgressAttempts()
    .map((attempt) => attempt.band)
    .filter(
      (band): band is number =>
        typeof band === "number" && !Number.isNaN(band),
    );

  if (bands.length === 0) {
    return null;
  }

  const average =
    bands.reduce(
      (total, band) => total + band,
      0,
    ) / bands.length;

  return Math.round(average * 2) / 2;
}

export function getWeakestSkill() {
  const scores = (
    [
      "reading",
      "listening",
      "writing",
      "speaking",
    ] as ProgressSkill[]
  )
    .map((skill) => {
      const latest = getLatestSkillAttempt(skill);

      return {
        skill,
        band: latest?.band ?? null,
      };
    })
    .filter(
      (item) =>
        typeof item.band === "number",
    );

  if (scores.length === 0) {
    return null;
  }

  return scores.reduce((weakest, current) =>
    current.band! < weakest.band!
      ? current
      : weakest,
  );
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}