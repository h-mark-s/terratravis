'use strict';

const addQuestion = document.querySelector('.add-question');
const manageQuestions = document.querySelector('.manage-questions');

window.onload = () => {
  refreshQuestions();
}

function refreshQuestions() {
  const getQuestions = new XMLHttpRequest();
  getQuestions.open('GET', 'http://localhost:5500/api/questions');
  getQuestions.setRequestHeader('Content-Type', 'application/json');
  getQuestions.onload = data => {
    const response = JSON.parse(data.target.response);
    response.forEach(data => {
      
      const row = document.createElement('tr');
      row.id = data.id;
      const tableData = document.createElement('td');
      tableData.innerText = data.question;
      row.appendChild(tableData);
      
      const deleteButton = document.createElement('button');
      deleteButton.id = data.id;
      deleteButton.addEventListener('click', (event) => {
        const deleteQuestion = new XMLHttpRequest();
        deleteQuestion.open('DELETE', `http://localhost:5500/api/questions/${data.id}`);
        deleteQuestion.onload = () => {
          document.querySelectorAll('tr').forEach(row => {
            if(row.id === event.target.id) {
              manageQuestions.removeChild(row);
            };
          });
        }
        deleteQuestion.send();
      });
      deleteButton.innerText = 'delete';
      const deleteButtonContainer = document.createElement('td');
      deleteButtonContainer.appendChild(deleteButton);
      row.appendChild(deleteButtonContainer);
      manageQuestions.appendChild(row);
    });
  }
  getQuestions.send();
}

addQuestion.addEventListener('submit', (event) => {
  event.preventDefault();
  const xhr= new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5500/api/questions');
  xhr.setRequestHeader('Content-Type', 'application/json');
  let isCorrectArray = [];
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked === true) {
      isCorrectArray.push("1");
    } else {
      isCorrectArray.push("0");
    }
  }
  xhr.onload = data => {
    const addedQuestion = JSON.parse(data.target.response)[0];
    
    const row = document.createElement('tr');
    const tableData = document.createElement('td');
    
    row.id = addedQuestion.id;
    tableData.innerText = document.querySelector('#question').value;
    row.appendChild(tableData);
    
    const deleteButton = document.createElement('button');
    deleteButton.id = addedQuestion.id;
    deleteButton.addEventListener('click', (event) => {
      const deleteQuestion = new XMLHttpRequest();
      deleteQuestion.open('DELETE', `http://localhost:5500/api/questions/${data.id}`);
      deleteQuestion.onload = () => {
        document.querySelectorAll('tr').forEach(row => {
          if(row.id === event.target.id) {
            manageQuestions.removeChild(row);
          };
        });
      }
      deleteQuestion.send();
    });
    deleteButton.innerText = 'delete';
    row.appendChild(deleteButton);
    manageQuestions.appendChild(row);
    addQuestion.reset()
  }
  xhr.send(JSON.stringify({
    "question": event.target.elements.question.value,
    "answers": [
      {
        "answer": event.target.elements["answer-one"].value,
        "is_correct": isCorrectArray[0],
      },
      {
        "answer": event.target.elements["answer-two"].value,
        "is_correct": isCorrectArray[1],
      },
      {
        "answer": event.target.elements["answer-three"].value,
        "is_correct": isCorrectArray[2],
      },
      {
        "answer": event.target.elements["answer-four"].value,
        "is_correct": isCorrectArray[3],
      }
    ]
  }));
});
