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
    title: "React Test",
    category: "React",
    difficulty: "Easy",
    skill: "React",
    totalQuestions: 10,
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
        explanation:
          "JSX is a syntax extension to JavaScript that lets you write UI markup (similar to HTML) inside JavaScript, which React turns into element creation calls.",
      },
      {
        id: 2,
        question: "Which hook is used for component state?",
        options: ["useEffect", "useState", "useRef", "useMemo"],
        correctAnswer: 1,
        explanation:
          "useState is the primary Hook for adding local state to functional components.",
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
        explanation:
          "React is a library for building user interfaces (UI), primarily for web applications.",
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
        explanation:
          "The Virtual DOM is an in-memory representation of the UI used to efficiently compute updates before applying minimal changes to the real DOM.",
      },
      {
        id: 5,
        question: "Which company originally created React?",
        options: ["Google", "Microsoft", "Facebook", "Amazon"],
        correctAnswer: 2,
        explanation:
          "React was created at Facebook (now Meta) and open-sourced in 2013.",
      },
      {
        id: 6,
        question: "What is a React component?",
        options: [
          "A database table",
          "A reusable piece of UI",
          "A CSS class",
          "A server endpoint",
        ],
        correctAnswer: 1,
        explanation:
          "Components are reusable building blocks that describe what should appear on the screen for a given state/props.",
      },
      {
        id: 7,
        question: "What is the correct way to pass data from parent to child?",
        options: ["State", "Props", "Refs only", "Context only"],
        correctAnswer: 1,
        explanation:
          "Props are the primary way to pass data from a parent component to a child component.",
      },
      {
        id: 8,
        question: "Which prop is required when rendering a list of elements?",
        options: ["ref", "className", "key", "style"],
        correctAnswer: 2,
        explanation:
          "The key prop helps React efficiently reconcile list items between renders.",
      },
      {
        id: 9,
        question: "What does setState (or a state setter) trigger?",
        options: [
          "A full page reload",
          "A component re-render (with updated state)",
          "A network request automatically",
          "A CSS recalculation only",
        ],
        correctAnswer: 1,
        explanation:
          "Updating state schedules React to re-render the component so the UI reflects the new state.",
      },
      {
        id: 10,
        question: "What is a common way to handle user input in React?",
        options: [
          "Only by reading the DOM directly",
          "Controlled components using state and onChange",
          "By modifying HTML strings",
          "By using setTimeout",
        ],
        correctAnswer: 1,
        explanation:
          "Controlled components store input values in state and update them via event handlers like onChange.",
      },
    ],
  },
  {
    id: 2,
    title: "React Test",
    category: "React",
    difficulty: "Medium",
    skill: "React",
    totalQuestions: 11,
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
        explanation:
          "An empty dependency array means the effect runs once after the initial render; if it returns a cleanup function, that cleanup runs on unmount.",
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
        explanation:
          "Using the functional form setState(prev => ...) ensures you always compute from the most recent state, even when updates are batched.",
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
        explanation:
          "Cleanup prevents leaks and duplicate side effects by removing listeners, clearing intervals/timeouts, or canceling subscriptions when the effect re-runs or the component unmounts.",
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
        explanation:
          "useMemo caches the result of an expensive calculation and recomputes it only when dependencies change, helping reduce unnecessary work.",
      },
      {
        id: 5,
        question: "If you render a list in React, which prop helps React identify items?",
        options: ["id", "index", "key", "ref"],
        correctAnswer: 2,
        explanation:
          "The key prop should be stable and unique among siblings so React can efficiently reconcile list changes.",
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
        explanation:
          "React may batch state updates for performance; you should not assume setState is applied immediately.",
      },
      {
        id: 7,
        question: "What is the purpose of the dependency array in useEffect?",
        options: [
          "It determines which components can import the hook",
          "It lists values that trigger the effect to re-run when they change",
          "It enables server-side rendering",
          "It prevents state updates",
        ],
        correctAnswer: 1,
        explanation:
          "Dependencies tell React when the effect should re-run; React compares them between renders to decide whether to re-execute the effect.",
      },
      {
        id: 8,
        question: "What does useRef commonly provide?",
        options: [
          "A way to force re-renders",
          "A mutable value that persists across renders (often used for DOM refs)",
          "A replacement for useState",
          "An automatic memoization of objects",
        ],
        correctAnswer: 1,
        explanation:
          "useRef returns a stable object whose .current value can be mutated without triggering re-renders, often used for DOM references or storing instance-like values.",
      },
      {
        id: 9,
        question: "Which is true about derived state?",
        options: [
          "It should always be duplicated into component state",
          "It can often be computed from props/state during render instead of stored",
          "It requires useEffect to update",
          "It must be stored in context",
        ],
        correctAnswer: 1,
        explanation:
          "If a value can be computed from existing props/state, it’s often better to compute it during render to avoid inconsistencies.",
      },
      {
        id: 10,
        question: "In React, what is a controlled input?",
        options: [
          "An input that can't be edited",
          "An input where the value is driven by React state",
          "An input controlled by the browser only",
          "An input that uses refs exclusively",
        ],
        correctAnswer: 1,
        explanation:
          "Controlled inputs have their value tied to React state and update via onChange handlers, making state the single source of truth.",
      },
      {
        id: 11,
        question: "Which hook is best for complex state transitions based on actions?",
        options: ["useState", "useMemo", "useReducer", "useLayoutEffect"],
        correctAnswer: 2,
        explanation:
          "useReducer is a good fit when state logic is complex or when state transitions are easier to describe as actions.",
      },
    ],
  },
  {
    id: 9,
    title: "React Test",
    category: "React",
    difficulty: "Hard",
    skill: "React",
    totalQuestions: 10,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which React hook is commonly used to memoize a callback function?",
        options: ["useMemo", "useCallback", "useEffect", "useReducer"],
        correctAnswer: 1,
        explanation:
          "useCallback memoizes a function reference so it stays stable between renders unless its dependencies change.",
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
        explanation:
          "If parents create new inline objects/functions each render, children receiving them as props see changed references and may re-render even if the values are effectively the same.",
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
        explanation:
          "React.memo prevents re-rendering of a component when its props are shallowly equal to the previous render (unless state/context changes).",
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
        explanation:
          "Stable keys help React keep list items associated correctly across insertions, deletions, and reordering.",
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
        explanation:
          "useReducer is useful when state transitions are complex or when the next state depends on multiple factors and you want predictable updates via actions.",
      },
      {
        id: 6,
        question:
          "In React 18, what feature can improve UI responsiveness during heavy updates?",
        options: ["Strict Mode", "Portals", "Transitions (startTransition)", "Refs"],
        correctAnswer: 2,
        explanation:
          "Transitions allow you to mark updates as non-urgent so React can keep the UI responsive by prioritizing more important updates.",
      },
      {
        id: 7,
        question: "What problem can excessive context usage cause?",
        options: [
          "Context can't be used in function components",
          "Any context value change can re-render many consumers",
          "Context automatically memoizes all values",
          "Context only works with class components",
        ],
        correctAnswer: 1,
        explanation:
          "When a context value changes, all consuming components may re-render; splitting context or memoizing values can reduce unnecessary renders.",
      },
      {
        id: 8,
        question: "Which approach can reduce bundle size in React apps?",
        options: [
          "Always using inline styles",
          "Code splitting with dynamic import/lazy loading",
          "Replacing props with context",
          "Using more dependencies",
        ],
        correctAnswer: 1,
        explanation:
          "Code splitting loads code on-demand (e.g., React.lazy + Suspense), reducing initial bundle size and improving load performance.",
      },
      {
        id: 9,
        question: "Why can using array index as a key be problematic?",
        options: [
          "It breaks JSX compilation",
          "It can cause incorrect state/DOM associations when list order changes",
          "It makes React render slower in all cases",
          "It prevents using fragments",
        ],
        correctAnswer: 1,
        explanation:
          "If items are inserted/removed/reordered, index keys can make React reuse DOM nodes incorrectly, leading to bugs like inputs keeping wrong values.",
      },
      {
        id: 10,
        question: "Which tool helps you find unnecessary renders in development?",
        options: ["React Router", "React DevTools Profiler", "Babel", "ESLint only"],
        correctAnswer: 1,
        explanation:
          "React DevTools Profiler lets you record commits and see which components rendered and why, helping diagnose performance issues.",
      },
    ],
  },

  // -----------------------------
  // JavaScript
  // -----------------------------
  {
    id: 3,
    title: "JavaScript Test",
    category: "JavaScript",
    difficulty: "Easy",
    skill: "JavaScript",
    totalQuestions: 10,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "What is the result of typeof null in JavaScript?",
        options: ["null", "object", "undefined", "number"],
        correctAnswer: 1,
        explanation:
          "Due to a historical quirk, typeof null returns 'object' even though null is a primitive value.",
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
        explanation:
          "const prevents rebinding the variable, but if the value is an object/array, its contents can still be mutated.",
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
        explanation:
          "JSON.parse converts a JSON string into a JavaScript value (object, array, etc.).",
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
        explanation:
          "map returns a new array containing the result of applying the callback to each element (it does not mutate the original array).",
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
        explanation:
          "The event loop coordinates the call stack, task queues, and microtask queues to schedule asynchronous callbacks.",
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
        explanation:
          "A Promise represents a value that may be available now, later, or never, and provides then/catch/finally for handling outcomes.",
      },
      {
        id: 7,
        question: "Which value is falsy in JavaScript?",
        options: ["'0'", "[]", "0", "{}"],
        correctAnswer: 2,
        explanation:
          "0 is falsy. Strings like '0', arrays [], and objects {} are truthy.",
      },
      {
        id: 8,
        question: "What is the scope of a variable declared with let?",
        options: ["Function scope only", "Block scope", "Global scope only", "Module scope only"],
        correctAnswer: 1,
        explanation:
          "let is block-scoped, meaning it exists only within the nearest enclosing { } block.",
      },
      {
        id: 9,
        question: "What does '===' do compared to '=='?",
        options: [
          "Performs type coercion before comparing",
          "Compares both value and type without coercion",
          "Only compares object references",
          "Only compares numbers",
        ],
        correctAnswer: 1,
        explanation:
          "=== is strict equality: it compares both type and value without coercion (unlike ==).",
      },
      {
        id: 10,
        question: "Which built-in method removes the last element from an array?",
        options: ["shift()", "pop()", "push()", "unshift()"],
        correctAnswer: 1,
        explanation:
          "pop() removes and returns the last element of an array (it mutates the array).",
      },
    ],
  },
  {
    id: 4,
    title: "JavaScript Test",
    category: "JavaScript",
    difficulty: "Medium",
    skill: "JavaScript",
    totalQuestions: 10,
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
        explanation:
          "Spread expands an iterable (like an array) into individual elements, commonly used to copy/merge arrays.",
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
        explanation:
          "Destructuring assigns values from arrays/objects into variables in a concise way (e.g., const {a} = obj).",
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
        explanation:
          "Arrow functions capture 'this' from the surrounding scope; they do not create their own this binding.",
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
        explanation:
          "filter returns a new array containing only the elements for which the callback returns true.",
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
        explanation:
          "Optional chaining short-circuits and returns undefined instead of throwing when accessing properties on null/undefined.",
      },
      {
        id: 6,
        question: "What is a default parameter in JavaScript?",
        options: [
          "A parameter that must be provided",
          "A parameter with a fallback value if undefined is passed",
          "A parameter only for arrow functions",
          "A parameter that converts types automatically",
        ],
        correctAnswer: 1,
        explanation:
          "Default parameters allow a function parameter to have a default value when the argument is missing or undefined.",
      },
      {
        id: 7,
        question: "What is a template literal?",
        options: [
          "A string that cannot contain variables",
          "A string delimited by backticks that supports interpolation",
          "A JSON string format",
          "A CSS selector syntax",
        ],
        correctAnswer: 1,
        explanation:
          "Template literals use backticks (`) and support ${expression} interpolation and multi-line strings.",
      },
      {
        id: 8,
        question: "What does Array.prototype.find return?",
        options: [
          "An array of all matches",
          "The first element that matches the predicate (or undefined)",
          "The index of the first match",
          "A boolean",
        ],
        correctAnswer: 1,
        explanation:
          "find returns the first matching element; use findIndex to get the index instead.",
      },
      {
        id: 9,
        question: "What does 'import'/'export' provide in JavaScript?",
        options: [
          "A browser-only API for fetching",
          "An ES module system for sharing code between files",
          "A replacement for JSON.parse",
          "A way to define CSS modules",
        ],
        correctAnswer: 1,
        explanation:
          "ES modules use import/export for modular code organization and dependency management.",
      },
      {
        id: 10,
        question: "What is the purpose of the rest parameter (...args)?",
        options: [
          "To expand an array into arguments",
          "To collect remaining arguments into an array",
          "To stop a loop early",
          "To declare optional chaining",
        ],
        correctAnswer: 1,
        explanation:
          "Rest parameters collect remaining arguments into an array, e.g., function f(...args) { }.",
      },
    ],
  },
  {
    id: 10,
    title: "JavaScript Test",
    category: "JavaScript",
    difficulty: "Hard",
    skill: "JavaScript",
    totalQuestions: 10,
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
        explanation:
          "An async function always returns a Promise; returned values are wrapped in a resolved Promise and thrown errors become rejections.",
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
        explanation:
          "Promise.all aggregates multiple promises and resolves with an array of results when all succeed; it rejects immediately if any promise rejects.",
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
        explanation:
          "finally runs regardless of whether the promise resolves or rejects, commonly used for cleanup or resetting UI state.",
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
        explanation:
          "Array.prototype.forEach doesn't await async callbacks; use for...of or map + Promise.all if you need sequencing or aggregation.",
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
        explanation:
          "AbortController provides a signal you can pass to fetch() (and other APIs) to cancel in-flight requests.",
      },
      {
        id: 6,
        question: "Which scheduling queue runs before macrotasks in the event loop?",
        options: ["Microtasks (Promises)", "I/O callbacks", "Timers only", "Rendering only"],
        correctAnswer: 0,
        explanation:
          "Microtasks (like Promise callbacks) run after the current call stack completes but before the next macrotask (like setTimeout).",
      },
      {
        id: 7,
        question: "What does Promise.race do?",
        options: [
          "Waits for all promises to settle",
          "Settles as soon as the first input promise settles (resolve or reject)",
          "Always resolves with the fastest resolved promise",
          "Retries promises until one resolves",
        ],
        correctAnswer: 1,
        explanation:
          "Promise.race settles as soon as any input promise settles, whether resolved or rejected.",
      },
      {
        id: 8,
        question: "What is a microtask in JavaScript?",
        options: [
          "A callback scheduled with setTimeout",
          "A Promise callback scheduled to run before the next macrotask",
          "A DOM repaint",
          "A synchronous function call",
        ],
        correctAnswer: 1,
        explanation:
          "Promise then/catch callbacks are microtasks; they run after the current stack but before timers and I/O macrotasks.",
      },
      {
        id: 9,
        question: "Why might you use a concurrency limit for async tasks?",
        options: [
          "To make all tasks synchronous",
          "To avoid overwhelming network/CPU resources",
          "To disable the event loop",
          "To ensure tasks run in random order",
        ],
        correctAnswer: 1,
        explanation:
          "Limiting concurrency can prevent spikes in resource usage (e.g., too many simultaneous requests) and improve stability.",
      },
      {
        id: 10,
        question: "What does 'await' do when used on a Promise?",
        options: [
          "Converts the promise into a callback",
          "Pauses execution in the async function until the promise settles",
          "Blocks the entire JavaScript thread",
          "Automatically retries on failure",
        ],
        correctAnswer: 1,
        explanation:
          "await pauses within the async function until the promise resolves/rejects; it does not block the entire event loop.",
      },
    ],
  },

  // -----------------------------
  // HTML/CSS
  // -----------------------------
  {
    id: 5,
    title: "HTML/CSS Test",
    category: "HTML/CSS",
    difficulty: "Easy",
    skill: "HTML/CSS",
    totalQuestions: 10,
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
        explanation:
          "Semantic elements (like <nav>, <main>, <article>) provide meaning to browsers and assistive tech, improving accessibility and SEO.",
      },
      {
        id: 2,
        question: "Which HTML element is best for a site navigation block?",
        options: ["<div>", "<nav>", "<section>", "<header>"],
        correctAnswer: 1,
        explanation:
          "<nav> is the semantic element intended to contain major navigation links.",
      },
      {
        id: 3,
        question: "Which CSS property controls text size?",
        options: ["font-style", "text-size", "font-size", "size"],
        correctAnswer: 2,
        explanation:
          "font-size controls the rendered size of the font; text-size is not a standard CSS property.",
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
        explanation:
          "Flexbox provides a layout model for aligning and distributing space among items in a container, along a main/cross axis.",
      },
      {
        id: 5,
        question: "What is the default box-sizing value in CSS?",
        options: ["border-box", "content-box", "padding-box", "margin-box"],
        correctAnswer: 1,
        explanation:
          "By default, CSS uses content-box, where width/height apply to the content box and padding/border add to the final size.",
      },
      {
        id: 6,
        question: "Which unit is relative to the root font-size?",
        options: ["em", "rem", "px", "%"],
        correctAnswer: 1,
        explanation:
          "rem is relative to the root element’s font-size (usually <html>), while em is relative to the current element’s font-size.",
      },
      {
        id: 7,
        question: "Which HTML attribute provides alternative text for images?",
        options: ["title", "alt", "src", "href"],
        correctAnswer: 1,
        explanation:
          "alt provides alternative text for images, important for accessibility and when images fail to load.",
      },
      {
        id: 8,
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Styling System",
          "Colorful Style Syntax",
        ],
        correctAnswer: 1,
        explanation:
          "CSS stands for Cascading Style Sheets and controls presentation and layout for HTML documents.",
      },
      {
        id: 9,
        question: "Which selector targets an element by id?",
        options: [".myId", "#myId", "myId", "@myId"],
        correctAnswer: 1,
        explanation:
          "In CSS, #id targets a specific element with that id attribute value.",
      },
      {
        id: 10,
        question: "What does 'margin' do in CSS?",
        options: [
          "Adds space inside the border",
          "Adds space outside the border",
          "Changes font size",
          "Sets element opacity",
        ],
        correctAnswer: 1,
        explanation:
          "Margin controls the space outside an element’s border, creating separation from neighboring elements.",
      },
    ],
  },
  {
    id: 6,
    title: "HTML/CSS Test",
    category: "HTML/CSS",
    difficulty: "Medium",
    skill: "HTML/CSS",
    totalQuestions: 10,
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
        explanation:
          "Media queries conditionally apply CSS based on conditions like viewport width, orientation, or resolution.",
      },
      {
        id: 2,
        question: "Which CSS feature is ideal for 2D page layouts with rows/columns?",
        options: ["Flexbox", "Grid", "Floats", "Tables"],
        correctAnswer: 1,
        explanation:
          "CSS Grid is designed for two-dimensional layouts (rows and columns). Flexbox is one-dimensional (row or column).",
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
        explanation:
          "Mobile-first means writing styles for small screens first, then using min-width media queries to enhance for larger screens.",
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
        explanation:
          "justify-content aligns items along the main axis (e.g., horizontal in a row flex container).",
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
        explanation:
          "Readable contrast improves accessibility. Also avoid relying on color alone to convey important meaning.",
      },
      {
        id: 6,
        question: "What does 'max-width: 100%' on an image help with?",
        options: [
          "Forcing it to always be 100px wide",
          "Preventing it from overflowing its container",
          "Increasing image resolution",
          "Disabling responsiveness",
        ],
        correctAnswer: 1,
        explanation:
          "max-width: 100% makes images scale down to fit within their container, improving responsive behavior.",
      },
      {
        id: 7,
        question: "Which media query is typical for applying styles to screens wider than 768px?",
        options: [
          "@media (max-width: 768px)",
          "@media (min-width: 768px)",
          "@media (device-width: 768px)",
          "@media (aspect-ratio: 768px)",
        ],
        correctAnswer: 1,
        explanation:
          "min-width targets viewports at least that wide (often used in mobile-first designs).",
      },
      {
        id: 8,
        question: "In CSS Grid, what does 'grid-template-columns: repeat(3, 1fr)' mean?",
        options: [
          "3 rows each 1fr tall",
          "3 columns each taking an equal fraction of available space",
          "3 columns each 1px wide",
          "3 columns that auto-size to content only",
        ],
        correctAnswer: 1,
        explanation:
          "repeat(3, 1fr) creates three equal-width columns using fractional units.",
      },
      {
        id: 9,
        question: "Which property helps align items vertically in a flex row (cross axis)?",
        options: ["align-items", "justify-content", "flex-wrap", "gap"],
        correctAnswer: 0,
        explanation:
          "align-items controls alignment along the cross axis (vertical alignment when flex-direction is row).",
      },
      {
        id: 10,
        question: "What is a breakpoint in responsive design?",
        options: [
          "A JavaScript error",
          "A point where layout changes based on viewport size",
          "A CSS variable",
          "A device-specific font",
        ],
        correctAnswer: 1,
        explanation:
          "A breakpoint is a screen width (or other condition) where you adjust layout/styles to improve usability across devices.",
      },
    ],
  },

  // -----------------------------
  // Node.js
  // -----------------------------
  {
    id: 7,
    title: "Node.js Test",
    category: "Node.js",
    difficulty: "Easy",
    skill: "Node.js",
    totalQuestions: 10,
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
        explanation:
          "Node.js is a runtime environment that executes JavaScript outside the browser using the V8 engine.",
      },
      {
        id: 2,
        question: "Which module system is traditional in Node.js (pre-ESM)?",
        options: ["AMD", "CommonJS (require/module.exports)", "SystemJS", "UMD only"],
        correctAnswer: 1,
        explanation:
          "Historically, Node.js used CommonJS modules with require() and module.exports (ES modules were added later).",
      },
      {
        id: 3,
        question: "Which built-in module is commonly used to work with file paths?",
        options: ["stream", "fs", "path", "events"],
        correctAnswer: 2,
        explanation:
          "The path module provides utilities for working with file and directory paths in a cross-platform way.",
      },
      {
        id: 4,
        question: "What does npm stand for?",
        options: ["Node Package Manager", "New Project Maker", "Network Protocol Module", "Node Process Monitor"],
        correctAnswer: 0,
        explanation:
          "npm is the Node Package Manager, used to install and manage JavaScript packages.",
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
        explanation:
          "Node uses an event-driven, non-blocking I/O model that allows handling many concurrent connections efficiently.",
      },
      {
        id: 6,
        question: "What is a common way to read environment variables in Node.js?",
        options: ["process.env", "window.env", "env.get()", "node.env()"],
        correctAnswer: 0,
        explanation:
          "In Node.js, environment variables are accessible through process.env.",
      },
      {
        id: 7,
        question: "Which built-in module is used for creating an HTTP server?",
        options: ["http", "net", "url", "crypto"],
        correctAnswer: 0,
        explanation:
          "Node's http module provides createServer and related APIs to handle HTTP requests and responses.",
      },
      {
        id: 8,
        question: "What does 'non-blocking I/O' mean?",
        options: [
          "I/O always runs on the main thread",
          "I/O operations do not stop other code from executing while waiting",
          "I/O never fails",
          "I/O is always synchronous",
        ],
        correctAnswer: 1,
        explanation:
          "Non-blocking I/O allows Node to continue processing other work while waiting for I/O operations to complete.",
      },
      {
        id: 9,
        question: "Which is a typical use case for Node.js?",
        options: [
          "Building static images",
          "Building scalable network applications (APIs, real-time services)",
          "Only running SQL queries",
          "Rendering CSS animations",
        ],
        correctAnswer: 1,
        explanation:
          "Node.js is commonly used for APIs, web servers, real-time apps, and tooling due to its event-driven model.",
      },
      {
        id: 10,
        question: "What does 'package.json' primarily define?",
        options: [
          "HTML layout of the app",
          "Project metadata, scripts, and dependencies",
          "Database schema",
          "Operating system configuration",
        ],
        correctAnswer: 1,
        explanation:
          "package.json defines a Node project's metadata, dependencies, and runnable scripts.",
      },
    ],
  },
  {
    id: 8,
    title: "Node.js Test",
    category: "Node.js",
    difficulty: "Hard",
    skill: "Node.js",
    totalQuestions: 10,
    duration: "10 mins",
    questions: [
      {
        id: 1,
        question: "Which status code typically indicates a successful GET request?",
        options: ["201", "204", "200", "301"],
        correctAnswer: 2,
        explanation:
          "200 OK indicates a successful request and is the most common success status for GET responses.",
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
        explanation:
          "REST focuses on stateless interactions and manipulating resources using standard HTTP methods like GET/POST/PUT/DELETE.",
      },
      {
        id: 3,
        question: "In Express, which object is used to send a JSON response?",
        options: ["req.send()", "res.json()", "app.send()", "next.json()"],
        correctAnswer: 1,
        explanation:
          "Express uses the response object (res) to send responses; res.json() sends JSON with appropriate headers.",
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
        explanation:
          "Middleware functions can read/modify req/res and decide whether to pass control to the next handler in the chain.",
      },
      {
        id: 5,
        question: "Which header is commonly used for Bearer token auth?",
        options: ["X-Api-Key", "Authorization", "Set-Cookie", "Accept-Language"],
        correctAnswer: 1,
        explanation:
          "Bearer tokens are typically sent in the Authorization header, e.g., Authorization: Bearer <token>.",
      },
      {
        id: 6,
        question: "What is idempotency in HTTP?",
        options: [
          "A request that always returns JSON",
          "A request that can be repeated with the same effect on the server",
          "A request that must be encrypted",
          "A request that always creates a new resource",
        ],
        correctAnswer: 1,
        explanation:
          "Idempotent methods (like GET, PUT, DELETE in typical REST semantics) can be repeated without additional side effects beyond the first call.",
      },
      {
        id: 7,
        question: "Which status code means 'Not Found'?",
        options: ["401", "403", "404", "500"],
        correctAnswer: 2,
        explanation:
          "404 Not Found indicates the server cannot find the requested resource.",
      },
      {
        id: 8,
        question: "What does CORS control?",
        options: [
          "How CSS is loaded",
          "Which origins are allowed to make cross-origin requests",
          "How cookies are encrypted",
          "How Node schedules microtasks",
        ],
        correctAnswer: 1,
        explanation:
          "CORS is a browser security feature that controls cross-origin requests; servers send headers to indicate allowed origins/methods/headers.",
      },
      {
        id: 9,
        question: "Which method is commonly used to partially update a resource in REST?",
        options: ["GET", "POST", "PATCH", "HEAD"],
        correctAnswer: 2,
        explanation:
          "PATCH is commonly used for partial updates, whereas PUT typically represents full replacement of a resource.",
      },
      {
        id: 10,
        question: "What does 'Content-Type: application/json' indicate?",
        options: [
          "Response is HTML",
          "Body is JSON formatted",
          "Request uses cookies",
          "Connection is HTTP/2",
        ],
        correctAnswer: 1,
        explanation:
          "Content-Type describes the media type of the message body; application/json means the payload is JSON.",
      },
    ],
  },

  // -----------------------------
  // Java
  // -----------------------------
  {
    id: 11,
    title: "Java Test",
    category: "Java",
    difficulty: "Easy",
    skill: "Java",
    totalQuestions: 10,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which keyword is used to define a class in Java?",
        options: ["struct", "class", "define", "type"],
        correctAnswer: 1,
        explanation:
          "Java uses the class keyword to declare classes (Java does not have 'struct' like C/C++).",
      },
      {
        id: 2,
        question: "What is the size of an int in Java?",
        options: ["16-bit", "32-bit", "64-bit", "Depends on OS"],
        correctAnswer: 1,
        explanation:
          "An int in Java is always 32-bit signed, regardless of operating system or architecture.",
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
        explanation:
          "Java code compiles to bytecode, which runs on the JVM (enabling platform independence).",
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
        explanation:
          "A static method is associated with the class itself and can be called without creating an instance.",
      },
      {
        id: 5,
        question: "Which collection does NOT allow duplicates?",
        options: ["List", "Set", "ArrayList", "LinkedList"],
        correctAnswer: 1,
        explanation:
          "A Set enforces uniqueness; Lists (including ArrayList/LinkedList) allow duplicates.",
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
        explanation:
          "The JVM looks for public static void main(String[] args) as the program entry point.",
      },
      {
        id: 7,
        question: "Which access modifier makes a member visible only within the same class?",
        options: ["public", "protected", "private", "default (package-private)"],
        correctAnswer: 2,
        explanation:
          "private members are accessible only within the declaring class.",
      },
      {
        id: 8,
        question: "What does JVM stand for?",
        options: ["Java Verified Modules", "Java Virtual Machine", "Java Visual Model", "Just Valid Memory"],
        correctAnswer: 1,
        explanation:
          "JVM stands for Java Virtual Machine; it runs compiled Java bytecode.",
      },
      {
        id: 9,
        question: "Which keyword is used to create a subclass relationship?",
        options: ["implements", "extends", "inherits", "super"],
        correctAnswer: 1,
        explanation:
          "extends is used for class inheritance. implements is used to implement interfaces.",
      },
      {
        id: 10,
        question: "Which type is used to represent true/false values in Java?",
        options: ["bool", "Boolean", "boolean", "bit"],
        correctAnswer: 2,
        explanation:
          "boolean is the primitive type for true/false values (Boolean is the wrapper class).",
      },
    ],
  },
  {
    id: 12,
    title: "Java Test",
    category: "Java",
    difficulty: "Medium",
    skill: "Java",
    totalQuestions: 10,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which OOP principle is best described by 'hide implementation details'?",
        options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction only"],
        correctAnswer: 1,
        explanation:
          "Encapsulation means bundling data and methods together and restricting access to internal details (e.g., private fields with public getters/setters).",
      },
      {
        id: 2,
        question: "Which interface guarantees natural ordering for elements?",
        options: ["List", "Map", "Comparable", "Iterable"],
        correctAnswer: 2,
        explanation:
          "Comparable defines a natural ordering via compareTo, enabling sorting based on a type’s inherent order.",
      },
      {
        id: 3,
        question: "What is the time complexity of HashMap get() on average?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 0,
        explanation:
          "HashMap provides average O(1) lookup (though worst-case can degrade with many collisions).",
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
        explanation:
          "A final class cannot be extended. A final method cannot be overridden, and a final variable cannot be reassigned.",
      },
      {
        id: 5,
        question: "Which collection type stores key-value pairs?",
        options: ["Set", "Map", "Queue", "Stack"],
        correctAnswer: 1,
        explanation:
          "Map stores associations between keys and values (e.g., HashMap, TreeMap).",
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
        explanation:
          "Polymorphism allows a reference of an interface/superclass type to point to different concrete implementations, enabling dynamic dispatch.",
      },
      {
        id: 7,
        question: "Which collection maintains insertion order and allows duplicates?",
        options: ["HashSet", "TreeSet", "ArrayList", "HashMap"],
        correctAnswer: 2,
        explanation:
          "ArrayList is an ordered list implementation that preserves insertion order and allows duplicates.",
      },
      {
        id: 8,
        question: "What is the main difference between an interface and an abstract class (traditional view)?",
        options: [
          "Interfaces cannot have methods",
          "Abstract classes cannot have fields",
          "A class can implement multiple interfaces but extend only one class",
          "Interfaces cannot be implemented by classes",
        ],
        correctAnswer: 2,
        explanation:
          "Java allows multiple interface implementations, but a class can extend only one superclass (abstract or concrete).",
      },
      {
        id: 9,
        question: "Which keyword is used to call a superclass constructor?",
        options: ["this()", "super()", "base()", "parent()"],
        correctAnswer: 1,
        explanation:
          "super() calls a superclass constructor (and must be the first statement in a constructor when used).",
      },
      {
        id: 10,
        question: "Which Map implementation keeps keys sorted?",
        options: ["HashMap", "LinkedHashMap", "TreeMap", "WeakHashMap"],
        correctAnswer: 2,
        explanation:
          "TreeMap stores keys in sorted order (based on natural ordering or a provided Comparator).",
      },
    ],
  },

  // -----------------------------
  // Python
  // -----------------------------
  {
    id: 13,
    title: "Python Test",
    category: "Python",
    difficulty: "Easy",
    skill: "Python",
    totalQuestions: 10,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "Which data type is immutable in Python?",
        options: ["list", "dict", "set", "tuple"],
        correctAnswer: 3,
        explanation:
          "Tuples are immutable sequences; lists, dicts, and sets are mutable.",
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
        explanation:
          "PEP 8 is the style guide for Python code, covering naming conventions, formatting, and other best practices.",
      },
      {
        id: 3,
        question: "What is the output of len({'a': 1, 'b': 2})?",
        options: ["1", "2", "3", "Error"],
        correctAnswer: 1,
        explanation:
          "len() on a dictionary returns the number of keys; here there are two keys ('a' and 'b').",
      },
      {
        id: 4,
        question: "Which keyword is used to define a function in Python?",
        options: ["func", "def", "lambda", "function"],
        correctAnswer: 1,
        explanation:
          "def is used to define a named function. lambda defines an anonymous function expression.",
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
        explanation:
          "append mutates the list in-place by adding the element to the end.",
      },
      {
        id: 6,
        question: "What does 'None' represent in Python?",
        options: ["0", "An empty string", "A null/absence of value", "False always"],
        correctAnswer: 2,
        explanation:
          "None is a singleton object representing the absence of a value (similar to null in other languages).",
      },
      {
        id: 7,
        question: "Which statement about indentation in Python is correct?",
        options: [
          "Indentation is optional",
          "Indentation defines code blocks",
          "Indentation is only used in comments",
          "Indentation affects variable names",
        ],
        correctAnswer: 1,
        explanation:
          "Python uses indentation (whitespace) to define blocks for control flow and function/class bodies.",
      },
      {
        id: 8,
        question: "What does 'pip' primarily do?",
        options: [
          "Runs Python code faster",
          "Installs and manages Python packages",
          "Compiles Python to C",
          "Edits Python files",
        ],
        correctAnswer: 1,
        explanation:
          "pip is Python’s package installer, used to install and manage third-party libraries.",
      },
      {
        id: 9,
        question: "What is the result of 3 // 2 in Python?",
        options: ["1.5", "1", "2", "0"],
        correctAnswer: 1,
        explanation:
          "// is floor division, so 3 // 2 equals 1.",
      },
      {
        id: 10,
        question: "Which built-in function returns the type of an object?",
        options: ["typeof()", "type()", "class()", "gettype()"],
        correctAnswer: 1,
        explanation:
          "type(obj) returns the object's type (e.g., <class 'int'>).",
      },
    ],
  },
  {
    id: 14,
    title: "Python Test",
    category: "Python",
    difficulty: "Medium",
    skill: "Python",
    totalQuestions: 10,
    duration: "12 mins",
    questions: [
      {
        id: 1,
        question: "What does a list comprehension return?",
        options: ["A generator", "A list", "A tuple", "A dict"],
        correctAnswer: 1,
        explanation:
          "A list comprehension produces a list (use parentheses for a generator expression).",
      },
      {
        id: 2,
        question: "Which is the correct way to create a set in Python?",
        options: ["{}", "set()", "[]", "()"],
        correctAnswer: 1,
        explanation:
          "{} creates an empty dict, not a set. Use set() for an empty set, or {1,2} for a non-empty set literal.",
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
        explanation:
          "Dictionaries are optimized for mapping keys to values and fast lookups by key.",
      },
      {
        id: 4,
        question: "What does enumerate(iterable) provide?",
        options: ["Only the values", "Only the indices", "Pairs of (index, value)", "Pairs of (key, value)"],
        correctAnswer: 2,
        explanation:
          "enumerate yields (index, value) pairs, commonly used when you need both position and element.",
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
        explanation:
          "Slicing creates a new sequence (e.g., list, string). It does not mutate the original object.",
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
        explanation:
          "is checks whether two references point to the same object; == checks whether the values are equal.",
      },
      {
        id: 7,
        question: "What does dict.get(key, default) do?",
        options: [
          "Always raises KeyError if key missing",
          "Returns default if key missing instead of raising",
          "Deletes a key if missing",
          "Sorts dictionary keys",
        ],
        correctAnswer: 1,
        explanation:
          "dict.get returns the value for key if present; otherwise it returns the provided default (or None if not provided).",
      },
      {
        id: 8,
        question: "What does a set primarily provide?",
        options: [
          "Ordered storage with duplicates",
          "Unique elements and fast membership tests",
          "Key-value pairs",
          "Immutable sequences",
        ],
        correctAnswer: 1,
        explanation:
          "Sets store unique items and provide fast membership tests (e.g., x in my_set).",
      },
      {
        id: 9,
        question: "Which comprehension creates a dictionary?",
        options: [
          "[x for x in items]",
          "{x for x in items}",
          "{k: v for (k, v) in pairs}",
          "(x for x in items)",
        ],
        correctAnswer: 2,
        explanation:
          "{k: v for ...} is a dict comprehension; {x for ...} is a set comprehension.",
      },
      {
        id: 10,
        question: "What does 'in' check when used with a dict (e.g., key in my_dict)?",
        options: [
          "Whether a value exists",
          "Whether a key exists",
          "Whether dict is non-empty",
          "Whether dict is sorted",
        ],
        correctAnswer: 1,
        explanation:
          "By default, 'in' checks dictionary keys (not values).",
      },
    ],
  },

  // -----------------------------
  // Machine Learning
  // -----------------------------
  {
    id: 15,
    title: "Machine Learning Test",
    category: "Machine Learning",
    difficulty: "Easy",
    skill: "Machine Learning",
    totalQuestions: 10,
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
        explanation:
          "Supervised learning trains on examples where the correct output label/target is provided for each input.",
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
        explanation:
          "Spam detection is classification because the output is a discrete category (spam/not spam).",
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
        explanation:
          "Overfitting happens when a model learns noise or specifics of the training data, harming its ability to generalize to new data.",
      },
      {
        id: 4,
        question: "Which technique helps reduce overfitting?",
        options: [
          "Regularization",
          "Increasing training epochs indefinitely",
          "Removing validation set",
          "Using a larger learning rate always",
        ],
        correctAnswer: 0,
        explanation:
          "Regularization adds penalties/constraints (like L1/L2) to discourage overly complex models and improve generalization.",
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
        explanation:
          "A confusion matrix counts how often each class is correctly/incorrectly predicted (TP/FP/FN/TN for binary classification).",
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
        explanation:
          "A test set simulates unseen data so you can estimate how well the model generalizes beyond the training data.",
      },
      {
        id: 7,
        question: "Which is an unsupervised learning task?",
        options: [
          "Predicting salaries from resumes",
          "Clustering customers into groups",
          "Predicting spam emails",
          "Predicting house prices",
        ],
        correctAnswer: 1,
        explanation:
          "Clustering is a typical unsupervised task because it discovers structure in unlabeled data.",
      },
      {
        id: 8,
        question: "What is a feature in machine learning?",
        options: [
          "The final prediction label",
          "An input variable used to make predictions",
          "A training epoch count",
          "A loss function output only",
        ],
        correctAnswer: 1,
        explanation:
          "A feature is an input attribute (variable) used by a model to make predictions.",
      },
      {
        id: 9,
        question: "What does 'bias' in the bias-variance tradeoff typically refer to?",
        options: [
          "Sensitivity to training data fluctuations",
          "Error from overly simple assumptions (underfitting)",
          "Number of features in the dataset",
          "Only dataset sampling error",
        ],
        correctAnswer: 1,
        explanation:
          "High bias usually indicates underfitting—your model is too simple and misses relevant patterns.",
      },
      {
        id: 10,
        question: "Which is a common normalization/scaling method?",
        options: ["Standardization (z-score)", "Random shuffling", "One-hot encoding", "Bootstrapping only"],
        correctAnswer: 0,
        explanation:
          "Standardization rescales features to mean 0 and standard deviation 1, often improving optimization for many models.",
      },
    ],
  },
  {
    id: 16,
    title: "Machine Learning Test",
    category: "Machine Learning",
    difficulty: "Medium",
    skill: "Machine Learning",
    totalQuestions: 10,
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
        explanation:
          "Precision measures how many predicted positives are actually positive: TP / (TP + FP).",
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
        explanation:
          "Recall measures how many actual positives were recovered: TP / (TP + FN).",
      },
      {
        id: 3,
        question: "Which metric is most appropriate for imbalanced classes?",
        options: ["Accuracy only", "F1-score", "MSE", "R-squared"],
        correctAnswer: 1,
        explanation:
          "For imbalanced classes, accuracy can be misleading. F1-score balances precision and recall into one metric.",
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
        explanation:
          "Cross-validation evaluates the model across multiple splits (folds) to estimate variability and stability of performance.",
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
        explanation:
          "ROC-AUC summarizes how well a model ranks positives above negatives across decision thresholds (TPR vs FPR).",
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
        explanation:
          "Data leakage occurs when information from outside the training data (often from the test set) inadvertently influences training, causing overly optimistic results.",
      },
      {
        id: 7,
        question: "What does a baseline model help you do?",
        options: [
          "Guarantee production readiness",
          "Compare whether advanced models provide real improvement",
          "Avoid splitting data",
          "Eliminate bias completely",
        ],
        correctAnswer: 1,
        explanation:
          "A baseline provides a reference point so you can measure whether more complex models actually improve performance.",
      },
      {
        id: 8,
        question: "What is the main goal of a validation set?",
        options: [
          "Train the final model weights only",
          "Tune hyperparameters and select models",
          "Replace the test set entirely",
          "Increase training speed",
        ],
        correctAnswer: 1,
        explanation:
          "Validation data is typically used for model selection/hyperparameter tuning, while the test set is kept for final evaluation.",
      },
      {
        id: 9,
        question: "Which metric is common for regression problems?",
        options: ["Mean Squared Error (MSE)", "F1-score", "Accuracy", "Confusion matrix"],
        correctAnswer: 0,
        explanation:
          "MSE (and related metrics like MAE/RMSE) are commonly used to measure regression prediction error.",
      },
      {
        id: 10,
        question: "What does 'stratified' splitting help with in classification?",
        options: [
          "Sorting features alphabetically",
          "Preserving class distribution across train/test splits",
          "Removing outliers automatically",
          "Ensuring features are normalized",
        ],
        correctAnswer: 1,
        explanation:
          "Stratified splits keep class proportions similar across splits, which is important when classes are imbalanced.",
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
