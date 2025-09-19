<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .quiz-container {
      background: #fff;
      width: 400px;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
      text-align: center;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .question {
      font-size: 18px;
      margin-bottom: 15px;
    }
    .options {
      list-style: none;
      padding: 0;
    }
    .options li {
      margin: 8px 0;
    }
    button {
      margin-top: 15px;
      padding: 10px 20px;
      border: none;
      background: #2563eb;
      color: white;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background: #1d4ed8;
    }
    .result {
      font-size: 20px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <h1>Quiz App</h1>
    <div id="quiz">
      <p class="question" id="question"></p>
      <ul class="options" id="options"></ul>
      <button id="nextBtn">Next</button>
      <p class="result" id="result"></p>
    </div>
  </div>

  <script>
    const quizData = [
      {
        question: "What is the capital of India?",
        options: ["Delhi", "Mumbai", "Hyderabad", "Chennai"],
        answer: "Delhi"
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        answer: "Mars"
      },
      {
        question: "Who is the father of Computer Science?",
        options: ["Charles Babbage", "Albert Einstein", "Isaac Newton", "Alan Turing"],
        answer: "Charles Babbage"
      }
    ];

    let currentQuestion = 0;
    let score = 0;

    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const nextBtn = document.getElementById("nextBtn");
    const resultEl = document.getElementById("result");

    function loadQuestion() {
      resultEl.textContent = "";
      let currentQuiz = quizData[currentQuestion];
      questionEl.textContent = currentQuiz.question;
      optionsEl.innerHTML = "";
      currentQuiz.options.forEach(option => {
        const li = document.createElement("li");
        li.innerHTML = `<input type="radio" name="option" value="${option}"> ${option}`;
        optionsEl.appendChild(li);
      });
    }

    function getSelected() {
      const options = document.getElementsByName("option");
      for (let option of options) {
        if (option.checked) {
          return option.value;
        }
      }
      return null;
    }

    nextBtn.addEventListener("click", () => {
      const selected = getSelected();
      if (!selected) {
        alert("Please select an answer!");
        return;
      }

      if (selected === quizData[currentQuestion].answer) {
        score++;
      }

      currentQuestion++;
      if (currentQuestion < quizData.length) {
        loadQuestion();
      } else {
        questionEl.style.display = "none";
        optionsEl.style.display = "none";
        nextBtn.style.display = "none";
        resultEl.textContent = `You scored ${score} out of ${quizData.length}! 🎉`;
      }
    });

    loadQuestion();
  </script>
</body>
</html>
