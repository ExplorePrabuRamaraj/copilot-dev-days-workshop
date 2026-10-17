// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  createQuiz,
  answerQuestion,
  advanceQuiz,
  isQuizFinished,
  shuffle,
  isCorrect,
  formatTimeLeft,
  calculatePercentage,
  getGrade,
  getFeedbackMessage,
} = require("../src/quiz.js");

test("createQuiz creates a fresh initial state for the supplied questions", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, { questions, current: 0, score: 0, answered: false });
  assert.notEqual(state, createQuiz(questions));
});

test("isQuizFinished returns true for a quiz with no questions", () => {
  assert.equal(isQuizFinished(createQuiz([])), true);
});

test("answerQuestion records a correct answer without mutating the input", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 1);

  assert.equal(result.correct, true);
  assert.deepEqual(result.state, { ...state, score: 1, answered: true });
  assert.deepEqual(state, { questions: [{ answer: 1 }], current: 0, score: 0, answered: false });
});

test("answerQuestion records an incorrect answer without increasing the score", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 0);

  assert.equal(result.correct, false);
  assert.deepEqual(result.state, { ...state, answered: true });
  assert.deepEqual(state, { questions: [{ answer: 1 }], current: 0, score: 0, answered: false });
});

test("advanceQuiz moves to the next question and resets the answered state", () => {
  const state = { ...createQuiz([{ answer: 0 }, { answer: 1 }]), current: 0, score: 1, answered: true };
  const original = { ...state };
  const advanced = advanceQuiz(state);

  assert.deepEqual(advanced, { ...state, current: 1, answered: false });
  assert.deepEqual(state, original);
});

test("isQuizFinished returns false until the current question passes the end", () => {
  const state = createQuiz([{ answer: 0 }]);

  assert.equal(isQuizFinished(state), false);
  assert.equal(isQuizFinished(advanceQuiz(state)), true);
});

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
