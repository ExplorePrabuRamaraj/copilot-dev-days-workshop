// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  formatTimeLeft,
  calculatePercentage,
  getGrade,
  getFeedbackMessage,
} = require("../src/quiz.js");

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("formatTimeLeft formats the remaining seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade includes the documented grade thresholds", () => {
  assert.equal(getGrade(89), "B");
  assert.equal(getGrade(90), "A");
  assert.equal(getGrade(74), "C");
  assert.equal(getGrade(75), "B");
  assert.equal(getGrade(49), "Keep practicing");
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns the message for each grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work! You're a quiz master!");
  assert.equal(getFeedbackMessage("B"), "Good job! Keep up the great work!");
  assert.equal(getFeedbackMessage("C"), "Not bad! Keep practicing and you'll get better!");
  assert.equal(getFeedbackMessage("Keep practicing"), "Keep practicing and you'll get better!");
});
