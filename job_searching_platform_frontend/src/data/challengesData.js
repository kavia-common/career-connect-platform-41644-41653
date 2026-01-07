const challengesData = [
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
