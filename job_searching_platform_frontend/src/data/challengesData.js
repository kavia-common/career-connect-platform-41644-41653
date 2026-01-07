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
 *
 * IMPORTANT:
 * - Keep ids stable once introduced (localStorage progress maps by id).
 */
export const challenges = [
  // ------------------------------------------------------------
  // React
  // ------------------------------------------------------------
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
      { question: "What hook is used to manage context values in a component?", answer: "useContext" },
      { question: "What prop is used to pass content between component tags?", answer: "children" },
    ],
  },
  {
    id: 3,
    title: "React Components & Props",
    skill: "React",
    description: "Identify component concepts and prop usage",
    xp: 60,
    questions: [
      {
        question:
          "What is a React component that accepts props and returns JSX called?",
        answer: "function component",
      },
      { question: "Props are (mutable/immutable) inside a component?", answer: "immutable" },
      { question: "What key helps React identify items in a list?", answer: "key" },
      { question: "What is the default direction data flows in React?", answer: "one-way" },
      { question: "Passing a function as a prop is commonly used for what?", answer: "callbacks" },
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
      {
        question: "Which hook stores a mutable value that does not trigger re-render?",
        answer: "useRef",
      },
      { question: "Which hook memoizes a computed value?", answer: "useMemo" },
      { question: "Which hook memoizes a function reference?", answer: "useCallback" },
      { question: "A useEffect dependency array controls when the effect what?", answer: "runs" },
    ],
  },
  {
    id: 17,
    title: "React Router Quick Check",
    skill: "React",
    description: "Routing fundamentals: links, params, and navigation",
    xp: 85,
    questions: [
      { question: "Which component is commonly used for client-side navigation links?", answer: "Link" },
      { question: "Which hook reads URL params in React Router?", answer: "useParams" },
      { question: "Which hook is commonly used to navigate programmatically?", answer: "useNavigate" },
      { question: "Which component renders the best matching route's element?", answer: "Routes" },
      { question: "A dynamic URL segment like /users/:id is called a route what?", answer: "param" },
    ],
  },
  {
    id: 18,
    title: "React State Patterns",
    skill: "React",
    description: "When to lift state, derive state, and use reducers",
    xp: 95,
    questions: [
      { question: "Which hook is best for complex state transitions based on actions?", answer: "useReducer" },
      { question: "Moving shared state to the closest common parent is called?", answer: "lifting state up" },
      { question: "Data computed from existing state/props is often called?", answer: "derived state" },
      { question: "To avoid duplicating source of truth, prefer storing raw state and computing what?", answer: "values" },
      { question: "In a reducer pattern, state updates are typically triggered by?", answer: "actions" },
    ],
  },

  // ------------------------------------------------------------
  // JavaScript
  // ------------------------------------------------------------
  {
    id: 2,
    title: "JavaScript Logic Sprint",
    skill: "JavaScript",
    description: "Solve quick JS logic tasks",
    xp: 70,
    questions: [
      { question: "Which keyword declares a constant?", answer: "const" },
      { question: "typeof [] returns?", answer: "object" },
      { question: "Which operator is used for strict equality?", answer: "===" },
      { question: "What value represents 'no value' and is intentionally set?", answer: "null" },
      { question: "What built-in function converts a string to an integer?", answer: "parseInt" },
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
      { question: "A variable declared with let has what scope?", answer: "block" },
      { question: "What keyword declares a function-scoped variable?", answer: "var" },
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
      { question: "Which method reduces an array to a single value?", answer: "reduce" },
      { question: "Which method checks if at least one element matches a condition?", answer: "some" },
    ],
  },
  {
    id: 19,
    title: "JavaScript Async Basics",
    skill: "JavaScript",
    description: "Promises, async/await, and error handling",
    xp: 100,
    questions: [
      { question: "An async function always returns a what?", answer: "promise" },
      { question: "Which keyword pauses inside an async function until a Promise settles?", answer: "await" },
      { question: "Which method handles a rejected Promise?", answer: "catch" },
      { question: "Which Promise method runs after either resolve or reject?", answer: "finally" },
      { question: "Creating a Promise uses the new Promise what?", answer: "constructor" },
    ],
  },
  {
    id: 20,
    title: "JavaScript Debugging Essentials",
    skill: "JavaScript",
    description: "Practical debugging: console, breakpoints, and errors",
    xp: 80,
    questions: [
      { question: "Which statement logs values to the browser console?", answer: "console.log" },
      { question: "A thrown error can be handled with try and what?", answer: "catch" },
      { question: "In DevTools, pausing execution at a line is called a what?", answer: "breakpoint" },
      { question: "Which console method is commonly used to log errors?", answer: "console.error" },
      { question: "To inspect an object in DevTools, you can use console what?", answer: "dir" },
    ],
  },

  // ------------------------------------------------------------
  // Python
  // ------------------------------------------------------------
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
      { question: "Which keyword creates a loop over a range of numbers?", answer: "for" },
      { question: "What value represents the absence of a value in Python?", answer: "None" },
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
      { question: "Which collection type is ordered and mutable?", answer: "list" },
      { question: "Which collection type is ordered and immutable?", answer: "tuple" },
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
      { question: "A method shared by all instances of a class is called an instance what?", answer: "method" },
      { question: "To inherit from a base class, you put the base class name in the class what?", answer: "definition" },
    ],
  },
  {
    id: 21,
    title: "Python Testing Basics",
    skill: "Python",
    description: "Simple testing concepts and tooling",
    xp: 90,
    questions: [
      { question: "A common Python testing framework in the stdlib is called?", answer: "unittest" },
      { question: "In pytest, a function starting with which prefix is treated as a test?", answer: "test" },
      { question: "A check that a condition is true in tests is commonly called an?", answer: "assert" },
      { question: "In unittest, a common base class for test cases is Test what?", answer: "Case" },
      { question: "Tests should ideally be (deterministic/flaky)?", answer: "deterministic" },
    ],
  },

  // ------------------------------------------------------------
  // HTML/CSS
  // ------------------------------------------------------------
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
      { question: "Which semantic element typically contains introductory content?", answer: "header" },
      { question: "Which element typically contains page footer information?", answer: "footer" },
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
      { question: "Which property changes how an element's total width/height is calculated?", answer: "box-sizing" },
      { question: "In flexbox, which property controls spacing on the cross axis?", answer: "align-items" },
    ],
  },
  {
    id: 22,
    title: "CSS Specificity & Selectors",
    skill: "HTML/CSS",
    description: "Selectors, specificity, and cascade basics",
    xp: 85,
    questions: [
      { question: "Which selector targets an element by id?", answer: "#id" },
      { question: "Which selector targets elements by class?", answer: ".class" },
      { question: "In general, which is more specific: id or class?", answer: "id" },
      { question: "Which selector targets all elements?", answer: "*" },
      { question: "Which pseudo-class targets an element when hovered?", answer: ":hover" },
    ],
  },

  // ------------------------------------------------------------
  // Machine Learning
  // ------------------------------------------------------------
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
      { question: "Predicting categories (labels) is called?", answer: "classification" },
      { question: "Generalization refers to performance on what data?", answer: "unseen" },
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
      { question: "TN stands for?", answer: "true negative" },
      { question: "A table of TP/FP/TN/FN is called a confusion what?", answer: "matrix" },
    ],
  },
  {
    id: 23,
    title: "ML Data Prep Mini-Quiz",
    skill: "Machine Learning",
    description: "Train/test, scaling, and leakage awareness",
    xp: 115,
    questions: [
      { question: "Splitting data to measure generalization is called a train and what split?", answer: "test" },
      { question: "Scaling features to mean 0 and std 1 is called?", answer: "standardization" },
      { question: "When test info influences training, that's called data what?", answer: "leakage" },
      { question: "Handling missing values is often called data?", answer: "imputation" },
      { question: "Encoding categories as 0/1 vectors is called one-hot what?", answer: "encoding" },
    ],
  },

  // ------------------------------------------------------------
  // SQL
  // ------------------------------------------------------------
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
      { question: "Which SQL keyword returns only unique values?", answer: "distinct" },
      { question: "Which clause groups rows for aggregation?", answer: "group by" },
    ],
  },
  {
    id: 24,
    title: "SQL Joins Quick Check",
    skill: "SQL",
    description: "Join types and common join keys",
    xp: 95,
    questions: [
      { question: "Which JOIN returns only matching rows from both tables?", answer: "inner join" },
      { question: "Which JOIN keeps all rows from the left table?", answer: "left join" },
      { question: "A column used to relate tables is commonly called a what key?", answer: "foreign" },
      { question: "A JOIN condition is typically written using which keyword?", answer: "on" },
      { question: "A key that uniquely identifies a row in its own table is called a what key?", answer: "primary" },
    ],
  },

  // ------------------------------------------------------------
  // Git
  // ------------------------------------------------------------
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
      { question: "Which command shows the current branch and file status?", answer: "git status" },
      { question: "Which command uploads local commits to a remote?", answer: "git push" },
    ],
  },
  {
    id: 25,
    title: "Git Branching & Merging",
    skill: "Git",
    description: "Branch strategy basics: merge, rebase, and conflicts",
    xp: 90,
    questions: [
      { question: "Which command integrates another branch into the current one?", answer: "git merge" },
      { question: "Rewriting commits onto another base is called?", answer: "rebase" },
      { question: "A conflict often happens when two branches edit the same what?", answer: "lines" },
      { question: "The branch you merge into is often called the target what?", answer: "branch" },
      { question: "To abort a merge in progress, you can run git merge what?", answer: "--abort" },
    ],
  },

  // ------------------------------------------------------------
  // System Design
  // ------------------------------------------------------------
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
      { question: "A cache miss happens when the requested data is not in the?", answer: "cache" },
      { question: "A cache hit ratio measures the percentage of requests served from the?", answer: "cache" },
    ],
  },
  {
    id: 26,
    title: "System Design: API Reliability",
    skill: "System Design",
    description: "Resilience patterns: retries, timeouts, and rate limiting",
    xp: 140,
    questions: [
      { question: "A client-side limit to avoid calling an API too often is called?", answer: "rate limiting" },
      { question: "A max wait time before failing a request is called a?", answer: "timeout" },
      { question: "A pattern that stops calls after repeated failures is called a?", answer: "circuit breaker" },
      { question: "Repeated attempts after transient failures are called?", answer: "retries" },
      { question: "A strategy that spaces out retries over time is called exponential?", answer: "backoff" },
    ],
  },

  // ------------------------------------------------------------
  // Data Structures & Algorithms (new category)
  // ------------------------------------------------------------
  {
    id: 27,
    title: "DSA: Big-O Basics",
    skill: "Data Structures & Algorithms",
    description: "Complexity fundamentals: time, space, and common classes",
    xp: 120,
    questions: [
      { question: "A common way to describe algorithm growth is called?", answer: "big o" },
      { question: "Binary search runs in O( ? ) time on a sorted array.", answer: "log n" },
      { question: "A simple loop over n items is typically O( ? ).", answer: "n" },
      { question: "An algorithm that checks all pairs in n items is often O( ? ).", answer: "n^2" },
      { question: "Constant-time complexity is written as O( ? ).", answer: "1" },
    ],
  },
  {
    id: 28,
    title: "DSA: Core Data Structures",
    skill: "Data Structures & Algorithms",
    description: "Stacks, queues, and hash maps fundamentals",
    xp: 130,
    questions: [
      { question: "LIFO is characteristic of a?", answer: "stack" },
      { question: "FIFO is characteristic of a?", answer: "queue" },
      { question: "A structure providing fast key lookup is a?", answer: "hash map" },
      { question: "A tree where each node has at most two children is a binary?", answer: "tree" },
      { question: "A linked list node typically stores data and a pointer to the?", answer: "next" },
    ],
  },

  // ------------------------------------------------------------
  // Career Skills (new category)
  // ------------------------------------------------------------
  {
    id: 29,
    title: "Career Skills: Resume Essentials",
    skill: "Career Skills",
    description: "Practical resume basics for job applications",
    xp: 75,
    questions: [
      { question: "A resume bullet should ideally start with a strong action what?", answer: "verb" },
      { question: "Quantifying impact with numbers is called using?", answer: "metrics" },
      { question: "Tailoring your resume to a role helps match the job what?", answer: "description" },
      { question: "A concise one-line intro at the top is commonly called a resume?", answer: "summary" },
      { question: "A resume should ideally be free of spelling and grammar what?", answer: "errors" },
    ],
  },
  {
    id: 30,
    title: "Career Skills: Interview Fundamentals",
    skill: "Career Skills",
    description: "Behavioral interview basics and preparation",
    xp: 85,
    questions: [
      { question: "A common structure for behavioral answers is called the STAR what?", answer: "method" },
      { question: "In STAR, the 'T' stands for?", answer: "task" },
      { question: "Interview prep should include researching the company and the?", answer: "role" },
      { question: "After an interview, sending a thank-you what is a good practice?", answer: "email" },
      { question: "Practicing answers out loud helps improve clarity and what?", answer: "confidence" },
    ],
  },
];
