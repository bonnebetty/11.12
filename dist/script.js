// Add new question objects here when it is your turn.
const questions = [
  {
    topic: "JavaScript",
    question: "Which JavaScript method is used to listen for a user clicking a button?",
    choices: ["querySelector()", "addEventListener()", "console.log()", "createElement()"],
    correctAnswer: 1,
    explanation: "addEventListener() connects an event, such as a click, to a function that should run."
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

let currentQuestion = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const item = questions[currentQuestion];
  questionText.textContent = item.question;
  questionTopic.textContent = item.topic;
  answerChoices.querySelectorAll(".answer-option").forEach((option) => option.remove());

  item.choices.forEach((choice, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    label.innerHTML = `
      <input type="radio" name="answer" value="${index}" />
      <span class="choice-letter">${String.fromCharCode(65 + index)}</span>
      <span class="choice-text">${choice}</span>
    `;
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
  const selected = document.querySelector('input[name="answer"]:checked');

  if (!selected) {
    feedback.textContent = "Please choose an answer first.";
    feedback.className = "feedback error";
    return;
  }

  const selectedIndex = Number(selected.value);
  const correctIndex = questions[currentQuestion].correctAnswer;
  const options = document.querySelectorAll(".answer-option");
  answered = true;

  if (selectedIndex === correctIndex) {
    score += 1;
    options[selectedIndex].classList.add("correct");
    feedback.textContent = `✓ Correct! ${questions[currentQuestion].explanation}`;
    feedback.className = "feedback success";
  } else {
    options[selectedIndex].classList.add("incorrect");
    options[correctIndex].classList.add("correct");
    feedback.textContent = `Not quite. ${questions[currentQuestion].explanation}`;
    feedback.className = "feedback error";
  }

  scoreText.textContent = `Score: ${score}`;
  checkButton.disabled = true;
  document.querySelectorAll('input[name="answer"]').forEach((input) => { input.disabled = true; });
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
  checkAnswer();
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
