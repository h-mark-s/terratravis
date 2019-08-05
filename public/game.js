'use strict';

const score = document.querySelector('.score-value');
const question = document.querySelector('.question');
const answers = document.querySelectorAll('.answer');
const navigation = document.querySelector('.navigation');

let currentScore = 0;
let questionCounter = 0;

function newQuestion() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:5500/api/game');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = data => {
    let response = JSON.parse(data.target.response);
    if (response.error !== undefined) {
      question.innerText = `Congratulations! You scored ${currentScore} points out of ${questionCounter}!`
      const link = document.createElement('a');
      answers.forEach(button => {
        button.setAttribute('disabled', '');
        navigation.appendChild(link).setAttribute('href', 'http://localhost:5500/game')
      });
      link.innerText = 'PLAY AGAIN';
      return;
    }
    questionCounter++;
    score.innerText = 'score: ' + currentScore;
    question.innerText = response.question;
    for (let i = 0; i < answers.length; i++) {
      answers[i].innerText = response.answers[i].answer;
      if (response.answers[i]['is_correct'] === 1) {
        answers[i].setAttribute('class', 'correct');
      } else {
        answers[i].setAttribute('class', 'incorrect');
      }
    }
  }
  xhr.send();
}

window.onload = () => {
  newQuestion();
}

answers.forEach(answer => {
  answer.addEventListener('click', () => {
    if (answer.classList.contains('correct')) {
      answer.setAttribute('style', 'background: #00b967');
      currentScore++;
      score.innerText = 'score: ' + currentScore;
    } else {
      answer.setAttribute('style', 'background: #ac1d1c');
      document.querySelector('.correct').setAttribute('style', 'background: green');
    }
    answers.forEach(answer => {
      answer.setAttribute('disabled', '');
    });
    setTimeout(() => {
      newQuestion();
      answers.forEach(answer => {
        answer.setAttribute('style', '')
        answer.removeAttribute('disabled');
      });
    }, 1000);
  });
});
