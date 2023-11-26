// include the necessary libraries
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const dotenv = require('dotenv');

// define constants
const app = express();
const port = 3000;
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

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

// middleware to parse incoming JSON requests
app.use(bodyParser.json());
// middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// defines a route to the index
app.get('/index', (req, res) => {
  // path.join creates a platform-independent path to the HTML file
  res.render('home');
});

app.get(['/', '/home'], (req, res) => {
  res.redirect('/index');
})

// defines a route to the menu
app.get(['/menu/:table_num','/menu'], (req, res) => {
  // :table_num dictates the number of the table from the QR code
  const tableNumber = req.params.table_num;
  res.render('menu')
});

// defines a route to the payment gateway
app.get('/payment', (req, res) => {
  res.render('payment_gateway');
});

// defines a route to the payment successful page
app.get('/payment-succesful', (req, res) => {
  res.render('payment_successful');
});

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Query the database to check if the provided credentials are valid
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results, fields) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    } else {
      // Check if there is a matching user
      if (results.length > 0 ) {
        // Authentication successful
        const role = results[0].role;
        if ( role == 'admin'){
          res.redirect('admin-dashboard');
        }
        else if ( role == 'staff'){
          res.redirect('staff-dashboard');
        }
      } else {
        // Authentication failed
        res.status(401).send('Unauthorized');
      }
    }
  });
});

app.get('/admin-dashboard', (req, res) => {
  // Render the admin dashboard view or perform other actions
  res.render('admin-dashboard');
});

// response if the server is successfully running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
