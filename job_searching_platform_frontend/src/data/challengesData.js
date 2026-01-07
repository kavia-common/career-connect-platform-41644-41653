/**
 * PUBLIC_INTERFACE
 * Local static challenges dataset for the Gamified Challenges feature.
 *
 * Note: This data is user-provided and is the authoritative source for the
 * current frontend-only implementation. A backend API can replace this later.
 */
export const challenges = [
  {
    id: 1,
    title: "React Basics Challenge",
    skill: "React",
    description: "Answer 3 React questions to earn XP",
    xp: 50,
    questions: [
      {
        question: "What hook is used to manage state?",
        answer: "useState",
      },
      {
        question: "JSX stands for?",
        answer: "JavaScript XML",
      },
      {
        question: "Which company created React?",
        answer: "Facebook",
      },
    ],
  },
  {
    id: 2,
    title: "JavaScript Logic Sprint",
    skill: "JavaScript",
    description: "Solve quick JS logic tasks",
    xp: 70,
    questions: [
      {
        question: "Which keyword declares a constant?",
        answer: "const",
      },
      {
        question: "typeof [] returns?",
        answer: "object",
      },
    ],
  },
];
