const http = require('http');
const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'jay',
  password: '188502',
  database: 'dinescan',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});

app.get('/menu', (req, res) => {
  const query = 'SELECT dish_name, price FROM dishes';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching menu:', error);
      res.status(500).json({ error: 'Error fetching menu' });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connection.end();