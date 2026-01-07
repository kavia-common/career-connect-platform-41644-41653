/**
 * PUBLIC_INTERFACE
 * Local static challenges dataset for the Gamified Challenges feature.
 *
 * Note: This data is user-provided and is the authoritative source for the
 * current frontend-only implementation. A backend API can replace this later.
 *
 * Data shape:
 * - id: number (unique)
 * - title: string
 * - skill: string (used as category)
 * - description: string
 * - xp: number
 * - questions: Array<{ question: string, answer: string }>
 */
export const challenges = [
  // React
  {
    id: 1,
    title: "React Basics Challenge",
    skill: "React",
    description: "Answer 3 React questions to earn XP",
    xp: 50,
    questions: [
      { question: "What hook is used to manage state?", answer: "useState" },
      { question: "JSX stands for?", answer: "JavaScript XML" },
      { question: "Which company created React?", answer: "Facebook" },
    ],
  },
  {
    id: 3,
    title: "React Components & Props",
    skill: "React",
    description: "Identify component concepts and prop usage",
    xp: 60,
    questions: [
      { question: "What is a React component that accepts props and returns JSX called?", answer: "function component" },
      { question: "Props are (mutable/immutable) inside a component?", answer: "immutable" },
      { question: "What key helps React identify items in a list?", answer: "key" },
    ],
  },
  {
    id: 4,
    title: "React Hooks Essentials",
    skill: "React",
    description: "Hooks knowledge check: effects, refs, and memoization",
    xp: 80,
    questions: [
      { question: "Which hook is used for side effects?", answer: "useEffect" },
      { question: "Which hook stores a mutable value that does not trigger re-render?", answer: "useRef" },
      { question: "Which hook memoizes a computed value?", answer: "useMemo" },
    ],
  },

  // JavaScript
  {
    id: 2,
    title: "JavaScript Logic Sprint",
    skill: "JavaScript",
    description: "Solve quick JS logic tasks",
    xp: 70,
    questions: [
      { question: "Which keyword declares a constant?", answer: "const" },
      { question: "typeof [] returns?", answer: "object" },
    ],
  },
  {
    id: 5,
    title: "JavaScript Fundamentals",
    skill: "JavaScript",
    description: "Core language questions: scope, coercion, and equality",
    xp: 75,
    questions: [
      { question: "What is the result of '2' + 2 in JavaScript?", answer: "22" },
      { question: "Which operator compares value AND type?", answer: "===" },
      { question: "What keyword refers to the current object context (in most methods)?", answer: "this" },
    ],
  },
  {
    id: 6,
    title: "JavaScript Array Methods",
    skill: "JavaScript",
    description: "Common array transforms and searches",
    xp: 90,
    questions: [
      { question: "Which method creates a new array by transforming each element?", answer: "map" },
      { question: "Which method filters elements based on a predicate?", answer: "filter" },
      { question: "Which method returns the first matching element?", answer: "find" },
    ],
  },

  // Python
  {
    id: 7,
    title: "Python Basics Check",
    skill: "Python",
    description: "Syntax and core types quick quiz",
    xp: 60,
    questions: [
      { question: "How do you start a function definition in Python?", answer: "def" },
      { question: "What data type is returned by input()?", answer: "str" },
      { question: "What keyword is used to handle exceptions?", answer: "try" },
    ],
  },
  {
    id: 8,
    title: "Python Collections",
    skill: "Python",
    description: "Lists, dicts, sets, and tuples",
    xp: 85,
    questions: [
      { question: "Which collection type is unordered and contains unique items?", answer: "set" },
      { question: "What method adds an item to a set?", answer: "add" },
      { question: "What method gets a value from a dict with a fallback?", answer: "get" },
    ],
  },
  {
    id: 9,
    title: "Python OOP Essentials",
    skill: "Python",
    description: "Classes, init, and inheritance basics",
    xp: 95,
    questions: [
      { question: "What is the constructor method name in Python?", answer: "__init__" },
      { question: "What is the first parameter of instance methods typically named?", answer: "self" },
      { question: "Which function returns the type of an object?", answer: "type" },
    ],
  },

  // HTML/CSS
  {
    id: 10,
    title: "HTML Semantics",
    skill: "HTML/CSS",
    description: "Use correct semantic elements for structure and accessibility",
    xp: 55,
    questions: [
      { question: "Which tag represents the main content of a document?", answer: "main" },
      { question: "Which attribute provides alternative text for images?", answer: "alt" },
      { question: "Which element is used for navigation links?", answer: "nav" },
    ],
  },
  {
    id: 11,
    title: "CSS Layout Fundamentals",
    skill: "HTML/CSS",
    description: "Flexbox, grid, and box model concepts",
    xp: 80,
    questions: [
      { question: "Which CSS property controls the space inside an element?", answer: "padding" },
      { question: "Which CSS layout system uses rows and columns?", answer: "grid" },
      { question: "Which flexbox property controls main-axis alignment?", answer: "justify-content" },
    ],
  },

  // Machine Learning
  {
    id: 12,
    title: "ML Fundamentals",
    skill: "Machine Learning",
    description: "Core ML concepts: supervision, overfitting, and evaluation",
    xp: 110,
    questions: [
      { question: "Predicting a continuous value is called what type of task?", answer: "regression" },
      { question: "Training too closely to the training data is called?", answer: "overfitting" },
      { question: "A dataset split used for model selection is called the?", answer: "validation set" },
    ],
  },
  {
    id: 13,
    title: "Model Metrics Quick Quiz",
    skill: "Machine Learning",
    description: "Precision/recall basics and confusion matrix terms",
    xp: 120,
    questions: [
      { question: "TP stands for?", answer: "true positive" },
      { question: "Precision is TP divided by (TP + ___)?", answer: "false positive" },
      { question: "Recall is TP divided by (TP + ___)?", answer: "false negative" },
    ],
  },

  // SQL (extra category)
  {
    id: 14,
    title: "SQL Basics",
    skill: "SQL",
    description: "Queries, filtering, and aggregation essentials",
    xp: 70,
    questions: [
      { question: "Which SQL clause filters rows?", answer: "where" },
      { question: "Which SQL keyword sorts results?", answer: "order by" },
      { question: "Which function counts rows?", answer: "count" },
    ],
  },

  // Git (extra category)
  {
    id: 15,
    title: "Git Workflow Basics",
    skill: "Git",
    description: "Common commands for day-to-day collaboration",
    xp: 65,
    questions: [
      { question: "Which command creates a new commit?", answer: "git commit" },
      { question: "Which command downloads and integrates remote changes?", answer: "git pull" },
      { question: "Which command creates a new branch?", answer: "git branch" },
    ],
  },

  // System Design (extra category)
  {
    id: 16,
    title: "System Design: Caching Basics",
    skill: "System Design",
    description: "Core caching terms and trade-offs",
    xp: 130,
    questions: [
      { question: "A cache eviction policy abbreviation meaning Least Recently Used?", answer: "LRU" },
      { question: "Caching that stores data close to users is often called a?", answer: "CDN" },
      { question: "Storing results so repeated calls are faster is called?", answer: "memoization" },
    ],
  },
];
