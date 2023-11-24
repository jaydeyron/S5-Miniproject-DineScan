const mysql2 = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a connection to the MySQL server using mysql2
const connection = mysql2.createConnection({
  host: process.env.DBMS_host,
  user: process.env.DBMS_user,
  password: process.env.DBMS_password,
  database: 'dinescan', // Replace with your actual database name
  multipleStatements: true,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.DBMS_password + '\0')
  }
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Example query: Select all records from a 'users' table
  const query = 'SELECT * FROM DISHES';

  // Execute the query
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error('Error executing query:', err);
      connection.end();
      return;
    }

    // Print the query results
    console.log('Query Results:');
    console.log(results);
    console.log(fields);

    // Close the connection
    connection.end((endErr) => {
      if (endErr) {
        console.error('Error closing connection:', endErr);
      } else {
        console.log('Connection closed');
      }
    });
  });
});
