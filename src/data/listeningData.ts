export type ListeningQuestionType =
  | "multiple-choice"
  | "form-completion"
  | "sentence-completion";

export interface ListeningQuestion {
  id: number;
  type: ListeningQuestionType;
  question: string;
  options?: string[];
  answer: string;
}

export interface ListeningSection {
  number: number;
  title: string;
  script: string;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  id: string;
  testNumber: number;
  title: string;
  difficulty: "Standard" | "Challenging" | "Advanced";
  sections: ListeningSection[];
}

const sectionData: ListeningSection[] = [
  {
    number: 1,
    title: "Community Centre Enquiry",
    script:
      "Good morning. I'm calling because I'd like some information about the community centre. Certainly. What would you like to know? I'm particularly interested in the evening language classes. We have English, Spanish, and Italian. The English class is on Tuesday evenings at seven thirty. That sounds convenient. Is it suitable for beginners? Yes. The first part of the course is specifically designed for people with very little previous experience. And how much does the course cost? The full six-week course costs sixty pounds, although students receive a small discount.",
    questions: [
      {
        id: 1,
        type: "form-completion",
        question: "The English class begins at ______ in the evening.",
        answer: "7:30",
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "How long is the course?",
        options: ["4 weeks", "6 weeks", "8 weeks", "10 weeks"],
        answer: "6 weeks",
      },
      {
        id: 3,
        type: "form-completion",
        question: "The standard course costs ______ pounds.",
        answer: "60",
      },
      {
        id: 4,
        type: "multiple-choice",
        question: "Who receives a discount?",
        options: [
          "Teachers",
          "Children",
          "Students",
          "Retired people",
        ],
        answer: "Students",
      },
    ],
  },
  {
    number: 2,
    title: "Local Transport Project",
    script:
      "The city council has recently completed a review of local transport. The most important finding was that residents wanted more reliable services rather than simply more buses. As a result, the council plans to introduce a new timetable system next spring. The new system will provide passengers with live information at major stops. Another part of the project is the creation of secure bicycle parking near two railway stations. Construction is expected to begin in September.",
    questions: [
      {
        id: 5,
        type: "multiple-choice",
        question: "What did residents say was most important?",
        options: [
          "Cheaper tickets",
          "More reliable services",
          "New buses",
          "Longer operating hours",
        ],
        answer: "More reliable services",
      },
      {
        id: 6,
        type: "sentence-completion",
        question:
          "Live travel information will be available at major ______.",
        answer: "stops",
      },
      {
        id: 7,
        type: "multiple-choice",
        question:
          "Where will secure bicycle parking be created?",
        options: [
          "Near shopping centres",
          "Near schools",
          "Near two railway stations",
          "Near the airport",
        ],
        answer: "Near two railway stations",
      },
      {
        id: 8,
        type: "sentence-completion",
        question:
          "Construction is expected to begin in ______.",
        answer: "September",
      },
    ],
  },
  {
    number: 3,
    title: "University Research Discussion",
    script:
      "Let's look at the results from the first phase of the study. The response rate was higher than we expected, particularly among first-year students. That's interesting. Did the second-year group respond differently? Yes, their overall response was lower, but the answers they provided were considerably more detailed. What about the online questionnaire? We had some technical problems during the first week, which probably explains why fewer students completed it. The paper version actually produced the strongest response.",
    questions: [
      {
        id: 9,
        type: "multiple-choice",
        question: "Which group had the highest response rate?",
        options: [
          "First-year students",
          "Second-year students",
          "Postgraduate students",
          "Staff",
        ],
        answer: "First-year students",
      },
      {
        id: 10,
        type: "multiple-choice",
        question:
          "What was notable about the second-year responses?",
        options: [
          "They were shorter",
          "They were more detailed",
          "They arrived earlier",
          "They were mostly incomplete",
        ],
        answer: "They were more detailed",
      },
      {
        id: 11,
        type: "sentence-completion",
        question:
          "The online questionnaire had technical problems during the first ______.",
        answer: "week",
      },
      {
        id: 12,
        type: "multiple-choice",
        question:
          "Which method produced the strongest response?",
        options: [
          "Online questionnaire",
          "Telephone interviews",
          "Paper questionnaire",
          "Group discussion",
        ],
        answer: "Paper questionnaire",
      },
    ],
  },
  {
    number: 4,
    title: "The Future of Urban Trees",
    script:
      "Urban trees are often discussed in terms of appearance, but their practical value is much greater. Trees can reduce surface temperatures, improve air quality, and provide habitats for insects and birds. Recent research has also examined their effect on human behaviour. People tend to remain longer in streets and public spaces containing mature trees. However, planting trees successfully requires careful planning. The wrong species can damage pavements, interfere with underground services, or require excessive amounts of water.",
    questions: [
      {
        id: 13,
        type: "multiple-choice",
        question:
          "What is one practical benefit of urban trees?",
        options: [
          "They increase traffic",
          "They reduce surface temperatures",
          "They remove all pollution",
          "They reduce rainfall",
        ],
        answer: "They reduce surface temperatures",
      },
      {
        id: 14,
        type: "multiple-choice",
        question:
          "What behaviour has recent research examined?",
        options: [
          "How quickly people walk",
          "How people use public spaces",
          "How people choose trees",
          "How often people drive",
        ],
        answer: "How people use public spaces",
      },
      {
        id: 15,
        type: "sentence-completion",
        question:
          "People may remain longer in streets containing mature ______.",
        answer: "trees",
      },
      {
        id: 16,
        type: "multiple-choice",
        question:
          "Why must tree species be chosen carefully?",
        options: [
          "They can grow too slowly",
          "They can damage infrastructure",
          "They are difficult to transport",
          "They attract too many visitors",
        ],
        answer: "They can damage infrastructure",
      },
    ],
  },
];

function createTest(testNumber: number): ListeningTest {
  const difficulty: ListeningTest["difficulty"] =
    testNumber === 4
      ? "Advanced"
      : testNumber === 3
        ? "Challenging"
        : "Standard";

  return {
    id: `listening-test-${testNumber}`,
    testNumber,
    title: `Academic Listening · Test ${testNumber}`,
    difficulty,
    sections: sectionData,
  };
}

export const listeningTests: ListeningTest[] = [1, 2, 3, 4].map(
  createTest,
);

export function getListeningTest(testNumber: number) {
  return listeningTests.find(
    (test) => test.testNumber === testNumber,
  );
}