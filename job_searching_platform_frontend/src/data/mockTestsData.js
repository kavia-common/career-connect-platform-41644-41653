/**
 * Mock Tests static dataset used by the Mock Tests feature.
 *
 * Notes:
 * - This dataset is intentionally static (no backend dependency).
 * - Each test has a "category" used for filtering in the UI.
 * - Each test also has a "difficulty" (Easy | Medium | Hard) used for filtering in the UI.
 *
 * IMPORTANT:
 * - Keep ids stable (so localStorage progress continues to map correctly per-test).
 * - Question ids only need to be unique within a single test (the UI stores answers by question id per test).
 */

export const mockTests = [
  // -----------------------------
  // React
  // -----------------------------
  {
    id: 1,
    title: "React Fundamentals",
    category: "React",
    difficulty: "Easy",
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
        question: "Which hook is used for component state?",
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
        question: "What is the Virtual DOM?",
        options: [
          "A real DOM node",
          "A lightweight copy of the DOM kept in memory",
          "A browser API for animations",
          "A server-side DOM renderer",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which company originally created React?",
        options: ["Google", "Microsoft", "Facebook", "Amazon"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 2,
    title: "React State & Effects",
    category: "React",
    difficulty: "Medium",
    skill: "React",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "When does a useEffect with [] dependency array run?",
        options: [
          "Only on every re-render",
          "Only on mount (and cleanup on unmount)",
          "Only when props change",
          "Only when state changes",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question:
          "Which is the recommended way to update state that depends on previous state?",
        options: [
          "setCount(count + 1)",
          "setCount(() => count + 1)",
          "setCount((prev) => prev + 1)",
          "setCount(prev++)",
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What is a common reason to add a cleanup function in useEffect?",
        options: [
          "To avoid re-rendering",
          "To remove event listeners / cancel timers",
          "To memoize values",
          "To create context providers",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What does useMemo primarily help with?",
        options: [
          "Fetching data",
          "Memoizing expensive computations",
          "Managing form state",
          "Routing between pages",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "If you render a list in React, which prop helps React identify items?",
        options: ["id", "index", "key", "ref"],
        correctAnswer: 2,
      },
      {
        id: 6,
        question: "Which statement about state updates is true?",
        options: [
          "State updates are always synchronous.",
          "State updates may be batched and applied asynchronously.",
          "State updates mutate state directly.",
          "State updates require JSON.stringify.",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 9,
    title: "React Performance & Rendering",
    category: "React",
    difficulty: "Hard",
    skill: "React",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which React hook is commonly used to memoize a callback function?",
        options: ["useMemo", "useCallback", "useEffect", "useReducer"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question:
          "What is a common cause of unnecessary re-renders in child components?",
        options: [
          "Using CSS modules",
          "Passing new object/function references as props on every render",
          "Using semantic HTML",
          "Using React.StrictMode",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "React.memo primarily helps by:",
        options: [
          "Skipping rendering when props are shallow-equal",
          "Caching API responses automatically",
          "Replacing the Virtual DOM",
          "Batching all state updates synchronously",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Which statement about keys in lists is most accurate?",
        options: [
          "Using array index as key is always recommended",
          "Keys should be stable and unique among siblings",
          "Keys are only needed for server-side rendering",
          "Keys improve CSS specificity",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is a valid use case for useReducer?",
        options: [
          "Complex state logic with multiple sub-values",
          "Replacing CSS-in-JS",
          "Loading images faster",
          "Generating UUIDs",
        ],
        correctAnswer: 0,
      },
      {
        id: 6,
        question:
          "In React 18, what feature can improve UI responsiveness during heavy updates?",
        options: ["Strict Mode", "Portals", "Transitions (startTransition)", "Refs"],
        correctAnswer: 2,
      },
    ],
  },

  // -----------------------------
  // JavaScript
  // -----------------------------
  {
    id: 3,
    title: "JavaScript Essentials",
    category: "JavaScript",
    difficulty: "Easy",
    skill: "JavaScript",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "What is the result of typeof null in JavaScript?",
        options: ["null", "object", "undefined", "number"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which is true about const variables?",
        options: [
          "They cannot be reassigned, but objects can be mutated.",
          "They can always be reassigned.",
          "They are function-scoped.",
          "They must be declared without initialization.",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Which method converts JSON text into an object?",
        options: [
          "JSON.toObject()",
          "JSON.parse()",
          "JSON.stringify()",
          "Object.json()",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What does Array.prototype.map return?",
        options: ["A single value", "A new array", "The original array mutated", "A boolean"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is event loop responsible for?",
        options: [
          "Compiling JavaScript",
          "Managing asynchronous callbacks and the call stack",
          "Rendering HTML",
          "Encrypting network traffic",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "What is a Promise?",
        options: [
          "A synchronous function",
          "An object representing eventual completion/failure of an async operation",
          "A DOM event",
          "A CSS selector",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 4,
    title: "Modern JavaScript (ES6+)",
    category: "JavaScript",
    difficulty: "Medium",
    skill: "JavaScript",
    totalQuestions: 5,
    duration: "10 mins",
    questions: [
      {
        id: 1,
        question: "What does the spread operator (...) do in arrays?",
        options: [
          "Creates a promise",
          "Expands an iterable into individual elements",
          "Converts a string to a number",
          "Stops event propagation",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What is destructuring used for?",
        options: [
          "Removing elements from an array",
          "Extracting values from arrays/objects into variables",
          "Deleting object properties",
          "Creating class instances",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Arrow functions differ from function keyword because they:",
        options: [
          "Cannot return values",
          "Have their own this binding",
          "Do not have their own this binding",
          "Must be async",
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "What does Array.prototype.filter do?",
        options: [
          "Transforms each element",
          "Returns elements matching a predicate into a new array",
          "Sorts the array",
          "Finds an element index",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What does optional chaining (?.) prevent?",
        options: [
          "NaN results",
          "Syntax errors",
          "Errors when accessing properties on null/undefined",
          "Infinite loops",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 10,
    title: "JavaScript Async Patterns",
    category: "JavaScript",
    difficulty: "Hard",
    skill: "JavaScript",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which is true about async functions?",
        options: [
          "They always run in a new thread",
          "They return a Promise implicitly",
          "They cannot use try/catch",
          "They block the event loop until completion",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What does Promise.all do?",
        options: [
          "Resolves when all input promises resolve, or rejects if any reject",
          "Resolves as soon as the first promise resolves",
          "Converts callbacks into promises",
          "Retries failed promises automatically",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "When should you use a finally() handler?",
        options: [
          "Only when a promise resolves",
          "Only when a promise rejects",
          "To run cleanup code regardless of resolve/reject",
          "To convert a promise to synchronous code",
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "What is a common issue with using forEach with async/await?",
        options: [
          "It changes variable scope rules",
          "await inside forEach doesn't pause the outer flow",
          "It disables Promise.all",
          "It makes promises synchronous",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is an AbortController commonly used for?",
        options: [
          "Cancelling fetch requests",
          "Encrypting HTTP payloads",
          "Generating UUIDs",
          "Creating service workers",
        ],
        correctAnswer: 0,
      },
      {
        id: 6,
        question: "Which scheduling queue runs before macrotasks in the event loop?",
        options: ["Microtasks (Promises)", "I/O callbacks", "Timers only", "Rendering only"],
        correctAnswer: 0,
      },
    ],
  },

  // -----------------------------
  // HTML/CSS
  // -----------------------------
  {
    id: 5,
    title: "HTML & CSS Fundamentals",
    category: "HTML/CSS",
    difficulty: "Easy",
    skill: "HTML/CSS",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "What does semantic HTML help with most?",
        options: [
          "Improving SEO and accessibility",
          "Making pages load slower",
          "Replacing CSS",
          "Adding server-side rendering",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which HTML element is best for a site navigation block?",
        options: ["<div>", "<nav>", "<section>", "<header>"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which CSS property controls text size?",
        options: ["font-style", "text-size", "font-size", "size"],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "What does display: flex enable?",
        options: [
          "3D transforms",
          "Flexible layout and alignment for children in a container",
          "Server-side styling",
          "Automatic HTML validation",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is the default box-sizing value in CSS?",
        options: ["border-box", "content-box", "padding-box", "margin-box"],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "Which unit is relative to the root font-size?",
        options: ["em", "rem", "px", "%"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 6,
    title: "Responsive Layouts (CSS)",
    category: "HTML/CSS",
    difficulty: "Medium",
    skill: "HTML/CSS",
    totalQuestions: 5,
    duration: "10 mins",
    questions: [
      {
        id: 1,
        question: "What does a media query do?",
        options: [
          "Adds images to the page",
          "Applies CSS rules based on device characteristics (e.g., width)",
          "Sends network requests",
          "Compresses CSS files",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which CSS feature is ideal for 2D page layouts with rows/columns?",
        options: ["Flexbox", "Grid", "Floats", "Tables"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What is a common mobile-first approach?",
        options: [
          "Start with desktop styles and remove for mobile",
          "Start with base styles for small screens then add larger breakpoints",
          "Only use px units",
          "Avoid media queries",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What does justify-content control in flexbox?",
        options: [
          "Alignment along the main axis",
          "Alignment along the cross axis",
          "Font smoothing",
          "The element's z-index",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Which is a good practice for accessible color contrast?",
        options: [
          "Use light gray text on white background",
          "Use high-contrast text/background combinations",
          "Avoid labels and use placeholders",
          "Use color alone to convey meaning",
        ],
        correctAnswer: 1,
      },
    ],
  },

  // -----------------------------
  // Node.js
  // -----------------------------
  {
    id: 7,
    title: "Node.js Basics",
    category: "Node.js",
    difficulty: "Easy",
    skill: "Node.js",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Node.js is best described as:",
        options: [
          "A programming language",
          "A JavaScript runtime built on V8",
          "A CSS preprocessor",
          "A database engine",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which module system is traditional in Node.js (pre-ESM)?",
        options: ["AMD", "CommonJS (require/module.exports)", "SystemJS", "UMD only"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which built-in module is commonly used to work with file paths?",
        options: ["stream", "fs", "path", "events"],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "What does npm stand for?",
        options: ["Node Package Manager", "New Project Maker", "Network Protocol Module", "Node Process Monitor"],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Which statement about Node's event loop is true?",
        options: [
          "It blocks on every I/O operation",
          "It enables non-blocking I/O with asynchronous callbacks",
          "It runs only in the browser",
          "It requires a GUI thread",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "What is a common way to read environment variables in Node.js?",
        options: ["process.env", "window.env", "env.get()", "node.env()"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 8,
    title: "Node.js APIs & HTTP",
    category: "Node.js",
    difficulty: "Hard",
    skill: "Node.js",
    totalQuestions: 5,
    duration: "10 mins",
    questions: [
      {
        id: 1,
        question: "Which status code typically indicates a successful GET request?",
        options: ["201", "204", "200", "301"],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: "What does REST emphasize?",
        options: [
          "Tight coupling of services",
          "Stateless operations on resources via standard HTTP methods",
          "Only GraphQL APIs",
          "Binary-only request bodies",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "In Express, which object is used to send a JSON response?",
        options: ["req.send()", "res.json()", "app.send()", "next.json()"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What is middleware in Express?",
        options: [
          "A database table",
          "A function that runs during the request/response cycle",
          "A CSS framework",
          "A browser plugin",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which header is commonly used for Bearer token auth?",
        options: ["X-Api-Key", "Authorization", "Set-Cookie", "Accept-Language"],
        correctAnswer: 1,
      },
    ],
  },

  // -----------------------------
  // Java
  // -----------------------------
  {
    id: 11,
    title: "Java Basics",
    category: "Java",
    difficulty: "Easy",
    skill: "Java",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which keyword is used to define a class in Java?",
        options: ["struct", "class", "define", "type"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What is the size of an int in Java?",
        options: ["16-bit", "32-bit", "64-bit", "Depends on OS"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which is true about Java?",
        options: [
          "It is interpreted only",
          "It uses a virtual machine (JVM) to run bytecode",
          "It does not support OOP",
          "It is only for mobile apps",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What does 'static' mean for a method?",
        options: [
          "It can only be called once",
          "It belongs to the class, not instances",
          "It is private by default",
          "It must return void",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which collection does NOT allow duplicates?",
        options: ["List", "Set", "ArrayList", "LinkedList"],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "What is the correct entry point method signature for a Java program?",
        options: [
          "public void main(String[] args)",
          "public static void main(String[] args)",
          "static public int main(String[] args)",
          "public static int main(String[] args)",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 12,
    title: "Java OOP & Collections",
    category: "Java",
    difficulty: "Medium",
    skill: "Java",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which OOP principle is best described by 'hide implementation details'?",
        options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction only"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which interface guarantees natural ordering for elements?",
        options: ["List", "Map", "Comparable", "Iterable"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What is the time complexity of HashMap get() on average?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Which statement about 'final' is correct?",
        options: [
          "final means the variable can be reassigned",
          "final classes cannot be subclassed",
          "final methods can be overridden",
          "final is only for primitives",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which collection type stores key-value pairs?",
        options: ["Set", "Map", "Queue", "Stack"],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "What does 'polymorphism' enable?",
        options: [
          "Multiple inheritance in Java",
          "Treating objects of different classes through a common interface",
          "Automatic memory management",
          "Compiling bytecode to native code",
        ],
        correctAnswer: 1,
      },
    ],
  },

  // -----------------------------
  // Python
  // -----------------------------
  {
    id: 13,
    title: "Python Fundamentals",
    category: "Python",
    difficulty: "Easy",
    skill: "Python",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which data type is immutable in Python?",
        options: ["list", "dict", "set", "tuple"],
        correctAnswer: 3,
      },
      {
        id: 2,
        question: "What does 'PEP 8' refer to?",
        options: [
          "A Python package manager",
          "The Python style guide",
          "A database engine",
          "A unit testing framework",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What is the output of len({'a': 1, 'b': 2})?",
        options: ["1", "2", "3", "Error"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Which keyword is used to define a function in Python?",
        options: ["func", "def", "lambda", "function"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What does list.append(x) do?",
        options: [
          "Adds x to the end of the list",
          "Adds x to the beginning of the list",
          "Creates a new list with x",
          "Sorts the list",
        ],
        correctAnswer: 0,
      },
      {
        id: 6,
        question: "What does 'None' represent in Python?",
        options: ["0", "An empty string", "A null/absence of value", "False always"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 14,
    title: "Python Data Structures & Comprehensions",
    category: "Python",
    difficulty: "Medium",
    skill: "Python",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "What does a list comprehension return?",
        options: ["A generator", "A list", "A tuple", "A dict"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which is the correct way to create a set in Python?",
        options: ["{}", "set()", "[]", "()"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What is a common use case for a dictionary?",
        options: [
          "Storing unique values only",
          "Key-value lookup",
          "Maintaining insertion order only",
          "Stack operations",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What does enumerate(iterable) provide?",
        options: [
          "Only the values",
          "Only the indices",
          "Pairs of (index, value)",
          "Pairs of (key, value)",
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "Which statement about slicing is correct?",
        options: [
          "Slicing always mutates the original list",
          "Slicing returns a new sequence",
          "Slicing only works for strings",
          "Slicing requires a step argument",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "What is the difference between is and == in Python?",
        options: [
          "No difference",
          "is checks identity, == checks equality",
          "is checks value equality, == checks identity",
          "== is faster for objects",
        ],
        correctAnswer: 1,
      },
    ],
  },

  // -----------------------------
  // Machine Learning
  // -----------------------------
  {
    id: 15,
    title: "Machine Learning Basics",
    category: "Machine Learning",
    difficulty: "Easy",
    skill: "Machine Learning",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Supervised learning uses:",
        options: [
          "Only unlabeled data",
          "Labeled input-output pairs",
          "No training data",
          "Only reinforcement signals",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which is an example of a classification problem?",
        options: [
          "Predicting house price",
          "Predicting whether an email is spam",
          "Predicting temperature in Celsius",
          "Predicting stock value continuously",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What is overfitting?",
        options: [
          "Model performs well on train but poorly on unseen data",
          "Model performs poorly on train but well on test",
          "Using too little data",
          "Using too many features always improves accuracy",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Which technique helps reduce overfitting?",
        options: ["Regularization", "Increasing training epochs indefinitely", "Removing validation set", "Using a larger learning rate always"],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "What does a confusion matrix summarize?",
        options: [
          "Regression residuals",
          "True/false positives/negatives for classification",
          "Only model parameters",
          "Feature scaling values",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "Train/test split is mainly used to:",
        options: [
          "Increase the dataset size",
          "Measure generalization to unseen data",
          "Make training faster always",
          "Eliminate bias entirely",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 16,
    title: "Model Evaluation & Metrics",
    category: "Machine Learning",
    difficulty: "Medium",
    skill: "Machine Learning",
    totalQuestions: 6,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Precision is defined as:",
        options: [
          "TP / (TP + FP)",
          "TP / (TP + FN)",
          "(TP + TN) / total",
          "FN / (FN + FP)",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Recall is defined as:",
        options: [
          "TP / (TP + FP)",
          "TP / (TP + FN)",
          "TN / (TN + FP)",
          "FP / (FP + TN)",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which metric is most appropriate for imbalanced classes?",
        options: ["Accuracy only", "F1-score", "MSE", "R-squared"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Cross-validation helps by:",
        options: [
          "Training a model without any validation",
          "Estimating performance stability across folds",
          "Guaranteeing 100% accuracy",
          "Removing the need for feature engineering",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "ROC-AUC measures:",
        options: [
          "Regression error magnitude",
          "Tradeoff between TPR and FPR across thresholds",
          "Number of parameters in a model",
          "How fast the model trains",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "Which is true about data leakage?",
        options: [
          "It improves generalization",
          "It occurs when test information influences training",
          "It is required for normalization",
          "It only happens with deep learning models",
        ],
        correctAnswer: 1,
      },
    ],
  },
];

export const mockTestCategories = [
  "All",
  "React",
  "JavaScript",
  "Java",
  "Python",
  "Machine Learning",
  "HTML/CSS",
  "Node.js",
];
