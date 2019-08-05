'use strict';

const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');
require('dotenv').config();
const port = 5500;

let questionsAsked = [];

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

conn.connect(err => {
  if (err) {
    console.log(err.toString());
    res.status(404).send('Error connecting to database!');
    return;
  }
  console.log('Connection to DB is A-OK!');
});

app.use(express.json());
app.use(express.static('public'));

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/game.html'));
});

app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/' + 'questions.html'));
});

app.get('/api/game', (req, res) => {
  conn.query(`SELECT id FROM questions;`, (err, rows) => {
    if (err) {
      res.status(400).send('Database error!');
      return;
    }

    let allIds = [];

    rows.forEach(question => {
      allIds.push(question.id);
    });

    allIds = allIds.filter((element) => !questionsAsked.includes(element));

    let randomId = 0;

    if (allIds.length !== 0) {
      randomId = allIds[Math.floor(Math.random() * Math.floor(allIds.length))];
      questionsAsked.push(randomId);
    } else {
      res.status(404).json({
        "error": "no more questions to ask"
      });
      questionsAsked = [];
      return;
    }

    conn.query(
      `SELECT questions.id AS id, questions.question AS question, answers.*
      FROM questions
      LEFT JOIN answers
      ON questions.id = answers.question_id
      WHERE questions.id=?;`,
      [randomId],
      (err, rows) => {
        if (err) {
          console.log(err.toString());
          res.status(400).send('Database error!');
          return;
        }
        const answers = [];
        for (let i = 0; i < rows.length; i++) {
          answers.push({
            'question_id': rows[0].question_id,
            'id': rows[i].id,
            'answer': rows[i].answer,
            'is_correct': rows[i].is_correct
          });
        }
        res.json({
          'id': rows[0].question_id,
          'question': rows[0].question,
          'answers': answers
        });
      }
    );
  });
});

app.get('/api/questions', (req, res) => {
  conn.query('SELECT * FROM questions;', (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/questions', (req, res) => {
  conn.query('INSERT INTO questions(question) VALUES(?);', [req.body.question], (err) => {
    if (err) {
      console.log(err.toString());
      res.status(400).send('Database error!');
      return;
    }
    conn.query('SELECT id from questions ORDER BY id DESC LIMIT 1;', (err, id) => {
      if (err) {
        console.log(err.toString());
        res.status(400).send('Database error!');
        return;
      }
      for (let i = 0; i < req.body.answers.length; i++) {
        let isCorrect = Number(req.body.answers[i].is_correct);
        conn.query('INSERT INTO answers(question_id, answer, is_correct) VALUES(?, ?, ?);', [id[0].id, req.body.answers[i].answer, isCorrect], (err, rows) => {
          if (err) {
            console.log(err.toString());
            res.status(400).send('Database error!');
            return;
          }
        });
      }
      res.status(200).json(id);
    });    
  });
});

app.delete('/api/questions/:id', (req, res) => {
  conn.query('DELETE FROM questions WHERE id=?;', [req.params.id], (err) => {
    if (err) {
      console.log(err.toString());
      res.status(400).send('Database error!');
      return;
    }
    conn.query('DELETE FROM answers WHERE question_id=?;', [req.params.id], (err) => {
      if (err) {
        console.log(err.toString());
        res.status(400).send('Database error!');
        return;
      }
      res.status(200).send('Question deleted')
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
