const challengesData = [
  // New Challenge 1: Max in Array
  {
    id: 1001,
    title: "Maximum in Array",
    description: "Given an array of numbers, return the largest element.",
    funcName: "maxInArray",
    testCases: [
      { input: [[5, 1, 9, 3]], output: 9 },
      { input: [[-5, -11, -3, -7]], output: -3 },
      { input: [[42]], output: 42 },
      { input: [[2, 2, 2]], output: 2 },
      { input: [[1, 999, 2, 3]], output: 999 },
    ],
  },
  // New Challenge 2: Factorial
  {
    id: 1002,
    title: "Factorial",
    description: "Return the factorial of the given non-negative integer n.",
    funcName: "factorial",
    testCases: [
      { input: [0], output: 1 },
      { input: [1], output: 1 },
      { input: [3], output: 6 },
      { input: [5], output: 120 },
      { input: [7], output: 5040 },
    ],
  },
  // New Challenge 3: Palindrome Check
  {
    id: 1003,
    title: "Palindrome",
    description: "Check if the given string is a palindrome (reads the same forwards and backwards). Return true or false.",
    funcName: "palindrome",
    testCases: [
      { input: ["racecar"], output: true },
      { input: ["Madam"], output: false },
      { input: ["level"], output: true },
      { input: ["hello"], output: false },
      { input: ["a"], output: true },
      { input: [""], output: true },
    ],
  },
  // New Challenge 4: Nth Fibonacci Number
  {
    id: 1004,
    title: "Fibonacci Nth",
    description: "Return the nth Fibonacci number, with Fib(0) = 0 and Fib(1) = 1.",
    funcName: "fibonacciNth",
    testCases: [
      { input: [0], output: 0 },
      { input: [1], output: 1 },
      { input: [5], output: 5 },
      { input: [10], output: 55 },
      { input: [15], output: 610 },
    ],
  },
  // New Challenge 5: Count Vowels
  {
    id: 1005,
    title: "Count Vowels",
    description: "Count the number of vowels (a, e, i, o, u) in a string.",
    funcName: "countVowels",
    testCases: [
      { input: ["hello"], output: 2 },
      { input: ["sky"], output: 0 },
      { input: ["AEIOUaeiou"], output: 10 },
      { input: ["xyz"], output: 0 },
      { input: [""], output: 0 },
    ],
  },
  // New Challenge 6: Merge and Sort Arrays
  {
    id: 1006,
    title: "Merge and Sort Arrays",
    description: "Merge two arrays and return a single sorted array (ascending order).",
    funcName: "mergeAndSortArrays",
    testCases: [
      { input: [[1, 3, 5], [2, 4, 6]], output: [1,2,3,4,5,6] },
      { input: [[], [5, 3, 1]], output: [1,3,5] },
      { input: [[9], []], output: [9] },
      { input: [[-2, 0], [1]], output: [-2,0,1] },
      { input: [[], []], output: [] },
    ],
  },
  // New Challenge 7: Unique Elements
  {
    id: 1007,
    title: "Unique Elements",
    description: "Return an array of unique elements in the order they first appear.",
    funcName: "uniqueElements",
    testCases: [
      { input: [[1, 2, 2, 3, 1]], output: [1,2,3] },
      { input: [[42, 42, 42]], output: [42] },
      { input: [[3, 2, 1, 2, 3, 4]], output: [3,2,1,4] },
      { input: [[]], output: [] },
      { input: [[7,8,9]], output: [7,8,9] },
    ],
  },
  // New Challenge 8: Sum Array
  {
    id: 1008,
    title: "Sum Array",
    description: "Return the sum of all numbers in the array.",
    funcName: "sumArray",
    testCases: [
      { input: [[1, 2, 3]], output: 6 },
      { input: [[-5, 5]], output: 0 },
      { input: [[]], output: 0 },
      { input: [[10, 100, 1000]], output: 1110 },
      { input: [[0]], output: 0 },
    ],
  },
  // New Challenge 9: Is Anagram
  {
    id: 1009,
    title: "Is Anagram",
    description: "Check if two strings are anagrams (ignoring spaces and case). Return true or false.",
    funcName: "isAnagram",
    testCases: [
      { input: ["listen", "silent"], output: true },
      { input: ["Triangle", "Integral"], output: true },
      { input: ["apple", "pale"], output: false },
      { input: ["a gentleman", "elegant man"], output: true },
      { input: ["hello", "world"], output: false },
    ],
  },
  // New Challenge 10: Two Sum
  {
    id: 1010,
    title: "Two Sum",
    description: "Given an array and a target number, return true if any two numbers sum to the target, else false.",
    funcName: "twoSum",
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: true },
      { input: [[1, 2, 3], 6], output: false },
      { input: [[-1, 0, 1], 0], output: true },
      { input: [[3], 6], output: false },
      { input: [[], 10], output: false },
    ],
  },
  {
    id: 1,
    title: "Sum of Two Numbers",
    description: "Write a function that returns the sum of two numbers.",
    funcName: "sum",
    testCases: [
      { input: [2, 3], output: 5 },
      { input: [10, 5], output: 15 }
    ]
  },
  {
    id: 2,
    title: "Check Even Number",
    description: "Write a function that returns true if a number is even.",
    funcName: "isEven",
    testCases: [
      { input: [4], output: true },
      { input: [7], output: false }
    ]
  },
  {
    id: 3,
    title: "Reverse a String",
    description: "Write a function that reverses a given string.",
    funcName: "reverseString",
    testCases: [
      { input: ["hello"], output: "olleh" },
      { input: ["abc"], output: "cba" }
    ]
  }
];

export default challengesData;
