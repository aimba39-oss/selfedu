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

export type SkillTrendStatus =
  | "improving"
  | "declining"
  | "stable"
  | "not-enough-data";

export interface SkillTrend {
  skill: ProgressSkill;
  latestBand: number | null;
  previousBand: number | null;
  change: number | null;
  status: SkillTrendStatus;
  attempts: number;
}

export interface ProgressRecommendation {
  skill: ProgressSkill | null;
  title: string;
  description: string;
  actionLabel: string;
  route: string;
}

const STORAGE_KEY = "selfedu-progress";

const SKILLS: ProgressSkill[] = [
  "reading",
  "listening",
  "writing",
  "speaking",
];

export function getProgressAttempts(): ProgressAttempt[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidProgressAttempt);
  } catch {
    return [];
  }
}

function isValidProgressAttempt(
  value: unknown,
): value is ProgressAttempt {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.skill === "string" &&
    SKILLS.includes(item.skill as ProgressSkill) &&
    typeof item.score === "number" &&
    typeof item.title === "string" &&
    typeof item.date === "string"
  );
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
): ProgressAttempt[] {
  return getProgressAttempts()
    .filter((attempt) => attempt.skill === skill)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    );
}

export function getLatestSkillAttempt(
  skill: ProgressSkill,
): ProgressAttempt | null {
  return getSkillAttempts(skill)[0] ?? null;
}

export function getAverageBand(): number | null {
  const bands = getProgressAttempts()
    .map((attempt) => attempt.band)
    .filter(
      (band): band is number =>
        typeof band === "number" &&
        Number.isFinite(band),
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

export function getWeakestSkill(): {
  skill: ProgressSkill;
  band: number;
} | null {
  const scores = SKILLS.map((skill) => {
    const latest = getLatestSkillAttempt(skill);

    return {
      skill,
      band:
        typeof latest?.band === "number"
          ? latest.band
          : null,
    };
  }).filter(
    (
      item,
    ): item is {
      skill: ProgressSkill;
      band: number;
    } => typeof item.band === "number",
  );

  if (scores.length === 0) {
    return null;
  }

  return scores.reduce((weakest, current) =>
    current.band < weakest.band
      ? current
      : weakest,
  );
}

export function getSkillTrend(
  skill: ProgressSkill,
): SkillTrend {
  const attempts = getSkillAttempts(skill).filter(
    (attempt) =>
      typeof attempt.band === "number" &&
      Number.isFinite(attempt.band),
  );

  if (attempts.length === 0) {
    return {
      skill,
      latestBand: null,
      previousBand: null,
      change: null,
      status: "not-enough-data",
      attempts: 0,
    };
  }

  const latestBand = attempts[0].band ?? null;

  if (attempts.length === 1) {
    return {
      skill,
      latestBand,
      previousBand: null,
      change: null,
      status: "not-enough-data",
      attempts: 1,
    };
  }

  const previousBand = attempts[1].band ?? null;

  if (
    latestBand === null ||
    previousBand === null
  ) {
    return {
      skill,
      latestBand,
      previousBand,
      change: null,
      status: "not-enough-data",
      attempts: attempts.length,
    };
  }

  const change =
    Math.round(
      (latestBand - previousBand) * 10,
    ) / 10;

  let status: SkillTrendStatus = "stable";

  if (change > 0) {
    status = "improving";
  } else if (change < 0) {
    status = "declining";
  }

  return {
    skill,
    latestBand,
    previousBand,
    change,
    status,
    attempts: attempts.length,
  };
}

export function getAllSkillTrends(): Record<
  ProgressSkill,
  SkillTrend
> {
  return {
    reading: getSkillTrend("reading"),
    listening: getSkillTrend("listening"),
    writing: getSkillTrend("writing"),
    speaking: getSkillTrend("speaking"),
  };
}

export function getOverallTrend(): {
  change: number | null;
  status: SkillTrendStatus;
} {
  const attempts = getProgressAttempts()
    .filter(
      (attempt) =>
        typeof attempt.band === "number" &&
        Number.isFinite(attempt.band),
    )
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    );

  if (attempts.length < 2) {
    return {
      change: null,
      status: "not-enough-data",
    };
  }

  const first = attempts[0].band;
  const latest =
    attempts[attempts.length - 1].band;

  if (
    typeof first !== "number" ||
    typeof latest !== "number"
  ) {
    return {
      change: null,
      status: "not-enough-data",
    };
  }

  const change =
    Math.round((latest - first) * 10) / 10;

  if (change > 0) {
    return {
      change,
      status: "improving",
    };
  }

  if (change < 0) {
    return {
      change,
      status: "declining",
    };
  }

  return {
    change: 0,
    status: "stable",
  };
}

export function getProgressRecommendation(): ProgressRecommendation {
  const attempts = getProgressAttempts();

  if (attempts.length === 0) {
    return {
      skill: null,
      title: "Start with one real attempt.",
      description:
        "Complete any Reading, Listening, Writing, or Speaking task. Your dashboard will build itself from your actual performance.",
      actionLabel: "Start practicing",
      route: "/practice",
    };
  }

  const weakest = getWeakestSkill();

  if (!weakest) {
    return {
      skill: null,
      title: "Complete an evaluated skill.",
      description:
        "Your dashboard has activity, but it needs at least one band-scored attempt to make a meaningful recommendation.",
      actionLabel: "Open practice",
      route: "/practice",
    };
  }

  const trend = getSkillTrend(weakest.skill);

  const skillNames: Record<
    ProgressSkill,
    string
  > = {
    reading: "Reading",
    listening: "Listening",
    writing: "Writing",
    speaking: "Speaking",
  };

  const routes: Record<
    ProgressSkill,
    string
  > = {
    reading: "/reading",
    listening: "/listening",
    writing: "/writing",
    speaking: "/speaking",
  };

  const name = skillNames[weakest.skill];

  if (trend.status === "declining") {
    return {
      skill: weakest.skill,
      title: `${name} needs attention.`,
      description:
        `Your latest ${name} band is ${weakest.band.toFixed(1)}, and your most recent result moved down. Focus here before adding another strong area.`,
      actionLabel: `Practice ${name}`,
      route: routes[weakest.skill],
    };
  }

  if (trend.status === "improving") {
    return {
      skill: weakest.skill,
      title: `${name} is improving.`,
      description:
        `Your latest ${name} band is ${weakest.band.toFixed(1)}. Keep pushing this skill until it catches up with your stronger areas.`,
      actionLabel: `Continue ${name}`,
      route: routes[weakest.skill],
    };
  }

  return {
    skill: weakest.skill,
    title: `Build your ${name}.`,
    description:
      `Your latest recorded ${name} band is ${weakest.band.toFixed(1)}. This is currently your weakest measured skill.`,
    actionLabel: `Practice ${name}`,
    route: routes[weakest.skill],
  };
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}