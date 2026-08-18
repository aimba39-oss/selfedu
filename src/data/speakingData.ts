export type SpeakingPart = 1 | 2 | 3;

export interface SpeakingQuestion {
  id: number;
  part: SpeakingPart;
  prompt: string;
  followUp?: string[];
}

export const speakingQuestions: SpeakingQuestion[] = [
  {
    id: 1,
    part: 1,
    prompt: "Let's talk about your daily routine. What do you usually do on a typical weekday?",
    followUp: [
      "What part of your routine do you enjoy most?",
      "Would you like to change anything about your routine?",
    ],
  },
  {
    id: 2,
    part: 1,
    prompt: "Do you prefer studying alone or with other people?",
    followUp: [
      "Why do you prefer that approach?",
      "Has your preference changed over time?",
    ],
  },
  {
    id: 3,
    part: 1,
    prompt: "How often do you use technology for learning?",
    followUp: [
      "Which technology is most useful to you?",
      "Could you study without technology?",
    ],
  },
  {
    id: 4,
    part: 2,
    prompt:
      "Describe a skill you would like to learn in the future. You should say what the skill is, why you want to learn it, how you would learn it, and explain how it could be useful to you.",
  },
  {
    id: 5,
    part: 3,
    prompt:
      "Why do some people find it difficult to learn new skills as they get older?",
    followUp: [
      "Do schools teach enough practical skills?",
      "What skills will become more important in the future?",
    ],
  },
  {
    id: 6,
    part: 3,
    prompt:
      "Do you think technology has changed the way people learn?",
    followUp: [
      "Has this change been mostly positive?",
      "What could education look like in twenty years?",
    ],
  },
];

export function getQuestionsForPart(part: SpeakingPart) {
  return speakingQuestions.filter(
    (question) => question.part === part,
  );
}