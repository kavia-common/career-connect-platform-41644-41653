const challengesData = [
  {
    id: 1,
    category: "JavaScript",
    prompt: "Write a function named <strong>add</strong> that returns the sum of two numbers.",
    starterCode: `function add(a, b) {\n  // Your code here\n}`,
    expectedOutput: "return a + b",
    keywords: ["return", "+"],
    xp: 50,
  },
  {
    id: 2,
    category: "Python",
    prompt: "Write a function called <strong>greet</strong> that returns the string 'Hello, World!'",
    starterCode: "def greet():\n    # Your code here",
    expectedOutput: "return 'Hello, World!'",
    keywords: ["return", "Hello", "World"],
    xp: 40,
  },
  {
    id: 3,
    category: "SQL",
    prompt: "Write a SQL query to select all columns from a table called <strong>employees</strong>.",
    starterCode: "-- Your query here",
    expectedOutput: "SELECT * FROM employees;",
    keywords: ["select", "*", "employees"],
    xp: 30,
  },
  {
    id: 4,
    category: "HTML",
    prompt: "Write an HTML tag to create a level-one heading (h1) with the text 'Welcome'.",
    starterCode: "<!-- Your code here -->",
    expectedOutput: "<h1>Welcome</h1>",
    keywords: ["h1", "Welcome"],
    xp: 20,
  },
  {
    id: 5,
    category: "CSS",
    prompt: "Write a CSS rule to set the background color of the body to light gray.",
    starterCode: "body {\n  \n}",
    expectedOutput: "background-color: lightgray;",
    keywords: ["background-color", "lightgray"],
    xp: 20,
  },
  // Add or expand challenges as needed
];

export default challengesData;
