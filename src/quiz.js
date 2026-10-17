// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Creates a fresh quiz state for the supplied questions.
 */
function createQuiz(questions) {
  return { questions, current: 0, score: 0, answered: false };
}

/**
 * Records an answer without changing the existing state.
 */
function answerQuestion(state, selectedIndex) {
  const correct = isCorrect(state.questions[state.current], selectedIndex);
  return {
    state: {
      ...state,
      score: state.score + (correct ? 1 : 0),
      answered: true,
    },
    correct,
  };
}

/**
 * Advances to the next question without changing the existing state.
 */
function advanceQuiz(state) {
  return { ...state, current: state.current + 1, answered: false };
}

/**
 * Returns true when the current question is beyond the end of the quiz.
 */
function isQuizFinished(state) {
  return state.current >= state.questions.length;
}

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Formats the remaining time for a quiz question.
 */
function formatTimeLeft(seconds) {
  return `⏱ ${seconds}s`;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

// Returns an encouraging message for a grade: "A", "B", "C" or anything else
function getFeedbackMessage(grade) {
  switch (grade) {
    case "A":
      return "Excellent work! You're a quiz master!";
    case "B":
      return "Good job! Keep up the great work!";
    case "C":
      return "Not bad! Keep practicing and you'll get better!";
    default:
      return "Keep practicing and you'll get better!";
  }
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
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
  };
}
