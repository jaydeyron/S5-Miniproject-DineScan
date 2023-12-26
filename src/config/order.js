const mysql = require('mysql2');

// MySQL database configuration
const dbConfig = {
  host: process.env.DBMS_host,
  user: process.env.DBMS_user,
  password: process.env.DBMS_password,
  database: process.env.DBMS_database,
};

// Function to add a user to the database
async function addUser(user) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results] = await connection.execute(
      'INSERT INTO users (username, password, role, first_name, last_name, email) VALUES (?, ?, ?, ?, ?, ?)',
      [user.username, user.password, user.role, user.first_name, user.last_name, user.email]
    );
    console.log('Record added successfully. User ID:', results.insertId);
  } catch (error) {
    console.error('Error adding user:', error.message);
  } finally {
    await connection.end();
  }
}

// Asynchronous function to collect user input
async function collectUserInput() {
  return new Promise(resolve => {
    const user = {};

    process.stdout.write('Enter username: ');
    process.stdin.on('data', data => {
      user.username = data.toString().trim();

      process.stdout.write('Enter password: ');
      process.stdin.on('data', data => {
        user.password = data.toString().trim();

        process.stdout.write('Select role (admin or staff): ');
        process.stdin.on('data', data => {
          user.role = data.toString().trim();

          process.stdout.write('Enter first name: ');
          process.stdin.on('data', data => {
            user.first_name = data.toString().trim();

            process.stdout.write('Enter last name: ');
            process.stdin.on('data', data => {
              user.last_name = data.toString().trim();

              process.stdout.write('Enter email: ');
              process.stdin.on('data', data => {
                user.email = data.toString().trim();
                resolve(user);
              });
            });
          });
        });
      });
    });
  });
}

// Main function to execute the script
async function main() {
  try {
    const userInput = await collectUserInput();
    await addUser(userInput);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Run the script
main();
