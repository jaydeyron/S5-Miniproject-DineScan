// include the necessary libraries
const mysql2 = require('mysql2');
const dotenv = require('dotenv');

// load the environment variables from .env file
dotenv.config();

// create a connection to the MySQL server
const connection = mysql2.createConnection({
  host: process.env.DBMS_host,
  user: process.env.DBMS_user,
  password: process.env.DBMS_password,
  database: process.env.DBMS_database,
  multipleStatements: true,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.DBMS_password + '\0')
  }
});

// connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // create the database and tables
  connection.query(`
    CREATE DATABASE IF NOT EXISTS dinescan;
    USE dinescan;

    CREATE TABLE IF NOT EXISTS dishes (
      dish_id INT AUTO_INCREMENT PRIMARY KEY,
      dish_name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      vegetarian BOOLEAN NOT NULL,
      available BOOLEAN NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment (
      payment_id INT AUTO_INCREMENT PRIMARY KEY,
      payment_type VARCHAR(255) NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customer (
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      payment_id INT NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      phone_num DECIMAL(10, 2) NOT NULL,
      order_date INT NOT NULL,
      table_num INT NOT NULL,
      FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
    );

    CREATE TABLE IF NOT EXISTS kitchen (
      order_id INT NOT NULL,
      dish_id INT NOT NULL,
      quantity INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES customer(order_id),
      FOREIGN KEY (dish_id) REFERENCES dishes(dish_id)
    );
  `, (err) => {
    if (err) {
      console.error('Error creating database and tables:', err);
      connection.end();
      return;
    }
    console.log('Database and tables created');

    // close the connection
    connection.end((endErr) => {
      if (endErr) {
        console.error('Error closing connection:', endErr);
      } else {
        console.log('Connection closed');
      }
    });
  });
});
