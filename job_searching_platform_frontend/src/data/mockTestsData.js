/**
 * Mock Tests static dataset used by the Mock Tests feature.
 * Sourced from the orchestrator attachment.
 */

export const mockTests = [
  {
    id: 1,
    title: "Frontend Developer Test",
    skill: "React",
    totalQuestions: 5,
    duration: "10 mins",
    questions: [
      {
        id: 1,
        question: "What is JSX in React?",
        options: [
          "A JavaScript syntax extension",
          "A database",
          "A CSS framework",
          "A backend language",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which hook is used for state?",
        options: ["useEffect", "useState", "useRef", "useMemo"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "React is mainly used for?",
        options: [
          "Database management",
          "Backend development",
          "UI development",
          "Testing",
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "What is Virtual DOM?",
        options: ["Real DOM", "Lightweight DOM copy", "Browser API", "Server DOM"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which company developed React?",
        options: ["Google", "Microsoft", "Facebook", "Amazon"],
        correctAnswer: 2,
      },
    ],
  },
];
