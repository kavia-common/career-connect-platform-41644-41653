/**
 * Mock Tests static dataset used by the Mock Tests feature.
 *
 * Notes:
 * - This dataset is intentionally static (no backend dependency).
 * - Each test has a "category" used for filtering in the UI.
 */

export const mockTests = [
  {
    id: 1,
    title: "React Fundamentals",
    category: "React",
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
        question:
          "What is a common reason to add a cleanup function in useEffect?",
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
        question:
          "If you render a list in React, which prop helps React identify items?",
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
    id: 3,
    title: "JavaScript Essentials",
    category: "JavaScript",
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
        options: ["JSON.toObject()", "JSON.parse()", "JSON.stringify()", "Object.json()"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What does Array.prototype.map return?",
        options: [
          "A single value",
          "A new array",
          "The original array mutated",
          "A boolean",
        ],
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
        question:
          "What is destructuring used for?",
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
    id: 5,
    title: "HTML & CSS Fundamentals",
    category: "HTML/CSS",
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
  {
    id: 7,
    title: "Node.js Basics",
    category: "Node.js",
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
        options: [
          "Node Package Manager",
          "New Project Maker",
          "Network Protocol Module",
          "Node Process Monitor",
        ],
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
];

export const mockTestCategories = ["All", "React", "JavaScript", "HTML/CSS", "Node.js"];
