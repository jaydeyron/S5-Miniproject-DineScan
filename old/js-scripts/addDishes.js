const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'jay',
  password: '188502',
  database: 'dinescan',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});

const dishName = 'Pizza';
const price = 10.99;
const vegetarian = true;
const available = false;

// SQL query to insert values into the "dishes" table
const query = 'INSERT INTO dishes (dish_name, price, vegetarian, available) VALUES (?, ?, ?, ?)';

// Execute the query with the provided values
connection.query(query, [dishName, price, vegetarian, available], (err, results) => {
  if (err) {
    console.error('Error inserting into the database: ' + err);
  } else {
    console.log('Data inserted into the dishes table.');
  }

  // Close the database connection
  connection.end();
});
