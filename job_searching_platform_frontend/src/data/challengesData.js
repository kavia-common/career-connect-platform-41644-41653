const challengesData = [
  // JavaScript
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
    id: 16,
    category: "JavaScript",
    prompt: "Write a function <strong>isEven</strong> that returns true if a number is even.",
    starterCode: `function isEven(n) {\n  // Your code here\n}`,
    expectedOutput: "return n % 2 === 0",
    keywords: ["%","===","return"],
    xp: 40,
  },
  {
    id: 17,
    category: "JavaScript",
    prompt: "Write a function <strong>reverseString</strong> that reverses a given string.",
    starterCode: `function reverseString(s) {\n  // Your code here\n}`,
    expectedOutput: "return s.split('').reverse().join('')",
    keywords: ["reverse", "split", "join"],
    xp: 60,
  },

  // Python
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
    id: 18,
    category: "Python",
    prompt: "Write a function <strong>factorial</strong> that returns the factorial of n (assume n ≥ 0).",
    starterCode: "def factorial(n):\n    # Your code here",
    expectedOutput: "if n == 0:\n        return 1",
    keywords: ["return", "*", "factorial"],
    xp: 60,
  },
  {
    id: 19,
    category: "Python",
    prompt: "Write a function <strong>is_palindrome</strong> that returns True if a string is a palindrome, False otherwise.",
    starterCode: "def is_palindrome(s):\n    # Your code here",
    expectedOutput: "return s == s[::-1]",
    keywords: ["return", "[::-1]", "=="],
    xp: 50,
  },

  // Java
  {
    id: 20,
    category: "Java",
    prompt: "Write a method <strong>square</strong> that returns the square of an integer parameter n.",
    starterCode: "public int square(int n) {\n    // Your code here\n}",
    expectedOutput: "return n * n;",
    keywords: ["return", "*"],
    xp: 40,
  },
  {
    id: 21,
    category: "Java",
    prompt: "Write a method <strong>reverseString</strong> that reverses a given String s.",
    starterCode: "public String reverseString(String s) {\n    // Your code here\n}",
    expectedOutput: "return new StringBuilder(s).reverse().toString();",
    keywords: ["StringBuilder", "reverse", "return"],
    xp: 65,
  },

  // React
  {
    id: 22,
    category: "React",
    prompt: "Create a simple <strong>Button</strong> component in React that accepts a <strong>label</strong> prop and displays it.",
    starterCode: `function Button({ label }) {\n  // Your code here\n}`,
    expectedOutput: "return <button>{label}</button>",
    keywords: ["button", "{label}"],
    xp: 45,
  },
  {
    id: 23,
    category: "React",
    prompt: "Write the useState import statement that lets you use <strong>useState</strong> in a React function component.",
    starterCode: "// Your code here",
    expectedOutput: `import { useState } from 'react';`,
    keywords: ["useState", "import"],
    xp: 30,
  },

  // Data Structures
  {
    id: 24,
    category: "Data Structures",
    prompt: "Write code to create an empty array named <strong>stack</strong> and push the number 10 onto it.",
    starterCode: "// Your code here",
    expectedOutput: "const stack = [];\nstack.push(10);",
    keywords: ["stack", "push", "10"],
    xp: 30,
  },
  {
    id: 25,
    category: "Data Structures",
    prompt: "Write a class <strong>Node</strong> in Python with attributes <strong>data</strong> and <strong>next</strong>.",
    starterCode: "class Node:\n    # Your code here",
    expectedOutput: "def __init__(self, data):\n        self.data = data\n        self.next = None",
    keywords: ["__init__", "self.next", "self.data"],
    xp: 50,
  },

  // Algorithms
  {
    id: 26,
    category: "Algorithms",
    prompt: "Write a function <strong>binarySearch</strong> in JavaScript that returns the index of target in a sorted array arr, or -1 if not found.",
    starterCode: `function binarySearch(arr, target) {\n  // Your code here\n}`,
    expectedOutput: "let left = 0, right = arr.length - 1;",
    keywords: ["while", "left", "right", "return"],
    xp: 85,
  },
  {
    id: 27,
    category: "Algorithms",
    prompt: "Write a Python function <strong>fibonacci</strong> that returns the nth Fibonacci number.",
    starterCode: "def fibonacci(n):\n    # Your code here",
    expectedOutput: "if n <= 1:\n        return n",
    keywords: ["return", "fibonacci"],
    xp: 70,
  },

  // SQL
  {
    id: 3,
    category: "SQL",
    prompt: "Write a SQL query to select all columns from a table called <strong>employees</strong>.",
    starterCode: "-- Your query here",
    expectedOutput: "SELECT * FROM employees;",
    keywords: ["select", "*", "employees"],
    xp: 30,
  },

  // HTML
  {
    id: 4,
    category: "HTML",
    prompt: "Write an HTML tag to create a level-one heading (h1) with the text 'Welcome'.",
    starterCode: "<!-- Your code here -->",
    expectedOutput: "<h1>Welcome</h1>",
    keywords: ["h1", "Welcome"],
    xp: 20,
  },

  // CSS
  {
    id: 5,
    category: "CSS",
    prompt: "Write a CSS rule to set the background color of the body to light gray.",
    starterCode: "body {\n  \n}",
    expectedOutput: "background-color: lightgray;",
    keywords: ["background-color", "lightgray"],
    xp: 20,
  },
];

export default challengesData;
