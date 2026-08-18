export type QuestionType =
  | "multiple-choice"
  | "true-false-not-given"
  | "sentence-completion";

export interface ReadingQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  answer: string;
}

export interface ReadingPassage {
  title: string;
  text: string[];
  questions: ReadingQuestion[];
}

export interface ReadingTest {
  id: string;
  testNumber: number;
  title: string;
  difficulty: "Standard" | "Challenging" | "Advanced";
  estimatedMinutes: number;
  passages: ReadingPassage[];
}

export interface ReadingBook {
  id: number;
  title: string;
  subtitle: string;
  tests: ReadingTest[];
}

const demoQuestions = (): ReadingQuestion[] => [
  {
    id: 1,
    type: "multiple-choice",
    question:
      "What is the main purpose of the passage?",
    options: [
      "To describe an historical event",
      "To explain a change in modern research",
      "To compare two cities",
      "To criticize a scientific theory",
    ],
    answer: "To explain a change in modern research",
  },
  {
    id: 2,
    type: "multiple-choice",
    question:
      "According to the passage, which factor had the greatest influence?",
    options: [
      "Population growth",
      "Improved technology",
      "Government policy",
      "Climate change",
    ],
    answer: "Improved technology",
  },
  {
    id: 3,
    type: "true-false-not-given",
    question:
      "Researchers had access to the same equipment before the major change.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: "FALSE",
  },
  {
    id: 4,
    type: "true-false-not-given",
    question:
      "The first experiments were conducted in university laboratories.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: "NOT GIVEN",
  },
  {
    id: 5,
    type: "sentence-completion",
    question:
      "The researchers changed their approach after a new form of ______ became available.",
    answer: "data",
  },
  {
    id: 6,
    type: "multiple-choice",
    question:
      "What does the author suggest about the future?",
    options: [
      "Progress will probably stop",
      "Further development is likely",
      "The field will disappear",
      "Researchers will return to older methods",
    ],
    answer: "Further development is likely",
  },
];

const passageTemplates = [
  {
    title: "The changing science of observation",
    text: [
      "For centuries, researchers depended heavily on direct observation. Notes were written by hand, measurements were recorded in simple tables, and comparisons often depended on information collected over long periods.",
      "The introduction of inexpensive digital sensors changed that process. Researchers could suddenly collect much larger quantities of information at much shorter intervals. More importantly, they could store and compare those observations without relying entirely on manual records.",
      "This did not make earlier methods useless. Instead, it created a combination of approaches. Field observations continued to provide context while digital systems provided scale. Many modern projects therefore rely on both forms of evidence.",
      "The result has been a gradual change rather than a sudden replacement. Researchers still ask questions in much the same way, but they now have more opportunities to test those questions against large collections of evidence.",
    ],
  },
  {
    title: "Cities designed for movement",
    text: [
      "Urban planners have long attempted to balance the needs of people travelling through a city with those of people who live there. As cities grew, roads were frequently widened in an effort to reduce congestion.",
      "Yet wider roads did not always solve the underlying problem. In some cases, additional road space encouraged more people to drive, eventually producing similar levels of congestion. Planners began looking at movement as a wider system.",
      "Public transport, walking routes, cycling infrastructure, and mixed-use neighbourhoods became part of the same discussion. Instead of asking how many vehicles could pass through a location, planners increasingly asked how efficiently people could reach their destinations.",
      "This shift has also affected the design of public spaces. Streets are no longer viewed exclusively as transport corridors. They can also function as places where people meet, work, shop, and spend time.",
    ],
  },
  {
    title: "Why attention is a limited resource",
    text: [
      "Human attention is powerful but limited. A person can deliberately focus on a complex problem, yet the ability to maintain that concentration decreases when competing signals constantly demand attention.",
      "Digital environments make this issue especially visible. Notifications, messages, visual changes, and multiple open tasks can create a feeling of productivity while reducing the amount of uninterrupted thinking taking place.",
      "Researchers studying attention therefore distinguish between activity and useful work. Completing many small actions may create visible progress, while a smaller number of uninterrupted periods may produce deeper understanding.",
      "The practical implication is not that technology must be avoided. Rather, environments can be designed so that important tasks receive periods of protected attention, with less important information handled later.",
    ],
  },
];

function createTest(
  book: number,
  test: number,
): ReadingTest {
  const difficulty =
    test === 4
      ? "Advanced"
      : test === 3
        ? "Challenging"
        : "Standard";

  return {
    id: `cam${book}-test${test}`,
    testNumber: test,
    title: `Academic Reading · Test ${test}`,
    difficulty,
    estimatedMinutes: 60,
    passages: passageTemplates.map((template, index) => ({
      title: `${template.title} · Passage ${index + 1}`,
      text: template.text,
      questions: demoQuestions(),
    })),
  };
}

export const readingBooks: ReadingBook[] = Array.from(
  { length: 21 },
  (_, index) => {
    const book = index + 1;

    return {
      id: book,
      title: `Cambridge ${book}`,
      subtitle: "IELTS Academic Reading",
      tests: [1, 2, 3, 4].map((test) =>
        createTest(book, test),
      ),
    };
  },
);

export function getReadingBook(bookId: number) {
  return readingBooks.find((book) => book.id === bookId);
}

export function getReadingTest(
  bookId: number,
  testNumber: number,
) {
  const book = getReadingBook(bookId);
  return book?.tests.find(
    (test) => test.testNumber === testNumber,
  );
}