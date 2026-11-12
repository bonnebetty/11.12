const questions = [
  {
    topic: "JavaScript",
    question: "Which JavaScript method is used to listen for a user clicking a button?",
    choices: ["querySelector()", "addEventListener()", "console.log()", "createElement()"],
    correctAnswer: 1,
    explanation: "addEventListener() connects an event, such as a click, to a function that should run."
  },
  {
    topic: "HTML",
    type: "multiple",
    question: "Which HTML elements can be used to organize content on a web page? Select all that apply.",
    choices: ["<header>", "<section>", "<article>", "<color>"],
    correctAnswers: [0, 1, 2],
    explanation: "<header>, <section>, and <article> are semantic elements for organizing content. <color> is not an HTML element."
  }
];

const quizForm = document.querySelector("#quizForm");
const answerChoices = document.querySelector("#answerChoices");
const questionText = document.querySelector("#questionText");
const questionTopic = document.querySelector("#questionTopic");
const checkButton = document.querySelector("#checkButton");
const resetButton = document.querySelector("#resetButton");
const feedback = document.querySelector("#feedback");
const scoreText = document.querySelector("#scoreText");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const questionNumber = document.querySelector("#questionNumber");
const answerInstructions = document.querySelector("#answerInstructions");

let currentQuestion = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const item = questions[currentQuestion];
  questionText.textContent = item.question;
  questionTopic.textContent = item.topic;
  questionNumber.textContent = String(currentQuestion + 1).padStart(2, "0");
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  answerInstructions.textContent = item.type === "multiple" ? "Choose all correct answers" : "Choose one answer";
  answerChoices.querySelectorAll(".answer-option").forEach((option) => option.remove());

  item.choices.forEach((choice, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    label.innerHTML = `
      <input type="${item.type === "multiple" ? "checkbox" : "radio"}" name="answer" value="${index}" />
      <span class="choice-letter">${String.fromCharCode(65 + index)}</span>
      <span class="choice-text"></span>
    `;
    label.querySelector(".choice-text").textContent = choice;
    answerChoices.append(label);
  });

  feedback.textContent = "";
  feedback.className = "feedback";
  checkButton.disabled = true;
  checkButton.innerHTML = 'Check answer <span aria-hidden="true">→</span>';
  answered = false;
}

function checkAnswer() {
  if (answered) return;
  const selected = [...document.querySelectorAll('input[name="answer"]:checked')];

  if (selected.length === 0) {
    feedback.textContent = "Please choose an answer first.";
    feedback.className = "feedback error";
    return;
  }

  const item = questions[currentQuestion];
  const selectedIndexes = selected.map((input) => Number(input.value));
  const correctIndexes = item.type === "multiple" ? item.correctAnswers : [item.correctAnswer];
  const options = document.querySelectorAll(".answer-option");
  answered = true;
  const isCorrect = selectedIndexes.length === correctIndexes.length
    && selectedIndexes.every((index) => correctIndexes.includes(index));

  if (isCorrect) {
    score += 1;
    correctIndexes.forEach((index) => options[index].classList.add("correct"));
    feedback.textContent = `✓ Correct! ${item.explanation}`;
    feedback.className = "feedback success";
  } else {
    selectedIndexes.filter((index) => !correctIndexes.includes(index))
      .forEach((index) => options[index].classList.add("incorrect"));
    correctIndexes.forEach((index) => options[index].classList.add("correct"));
    feedback.textContent = `Not quite. ${item.explanation}`;
    feedback.className = "feedback error";
  }

  scoreText.textContent = `Score: ${score}`;
  const hasNextQuestion = currentQuestion < questions.length - 1;
  checkButton.disabled = false;
  checkButton.innerHTML = hasNextQuestion
    ? 'Next question <span aria-hidden="true">→</span>'
    : 'Finish quiz <span aria-hidden="true">→</span>';
  document.querySelectorAll('input[name="answer"]').forEach((input) => { input.disabled = true; });
}

function goToNextQuestion() {
  if (!answered) {
    checkAnswer();
    return;
  }

  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    return;
  }

  feedback.textContent = `Quiz complete! Final score: ${score} out of ${questions.length}.`;
  feedback.className = "feedback success";
  checkButton.disabled = true;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreText.textContent = "Score: 0";
  renderQuestion();
}

// Event 1: submit the form by clicking the check button.
quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  goToNextQuestion();
});

// Event 2: enable the button when an answer changes.
answerChoices.addEventListener("change", () => {
  if (!answered) {
    checkButton.disabled = false;
    feedback.textContent = "";
  }
});

// Event 3: allow the Enter key to check an answer.
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !checkButton.disabled) {
    event.preventDefault();
    quizForm.requestSubmit();
  }
});

// Event 4: restart the quiz.
resetButton.addEventListener("click", resetQuiz);

renderQuestion();
