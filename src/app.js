// UI code: connects the quiz logic (quiz.js) to the page (index.html).

let state = createQuiz([]);
let timerId = null;
let timeLeft = 15;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("question-timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const answerFeedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const feedbackText = document.getElementById("feedback-text");

function showScreen(screenToShow) { 
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  stopTimer();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startTimer();
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimer() {
  timerText.textContent = formatTimeLeft(timeLeft);
  timerText.classList.toggle("timer--low", timeLeft <= 5);
}

function startTimer() {
  timeLeft = 15;
  updateTimer();
  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      stopTimer();
      timeExpired();
    }
  }, 1000);
}

function selectAnswer(selectedIndex, selectedButton) {
  if (state.answered) return;

  stopTimer();
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function timeExpired() {
  if (state.answered) return;

  state = answerQuestion(state, null).state;
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = "Time's up!";
  nextButton.hidden = false;
  nextButton.focus();
}

function handleNextQuestion() {
  stopTimer();
  state = advanceQuiz(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  document.getElementById("feedback-message").textContent = getFeedbackMessage(getGrade(percentage));
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", handleNextQuestion);
