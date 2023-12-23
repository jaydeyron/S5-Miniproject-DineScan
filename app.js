// include the necessary libraries
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql2 = require("mysql2");
const dotenv = require("dotenv");
const session = require("express-session");

// define constants
const app = express();
const port = 3000;

// load the environment variables from .env file
dotenv.config();

// create a connection to the MySQL server
const pool = mysql2.createPool({
  host: process.env.DBMS_host,
  user: process.env.DBMS_user,
  password: process.env.DBMS_password,
  database: process.env.DBMS_database,
  multipleStatements: true,
  authPlugins: {
    mysql_clear_password: () => () =>
      Buffer.from(process.env.DBMS_password + "\0"),
  },
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL pool:", err);
    return;
  }
  console.log("Connected to MySQL pool");
  // Release the connection back to the pool
  connection.release();
});

// session middleware
app.use(session({
  secret: '188502',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Define a middleware to check authentication status
const isAuthenticated = (req, res, next) => {
  // Check if the user is authenticated
  if (req.session.authenticated) {
    // If authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // If not authenticated, redirect to the login page
    res.redirect("/login");
  }
};

// middleware to parse incoming JSON requests and parse the incoming form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// defines a route to index
app.get("/index", (req, res) => {
  res.render("home");
});

// redirects a route to home towards index
app.get(["/", "/home"], (req, res) => {
  res.redirect("/index");
});

app.get("/admin-dashboard", (req, res) => {
  res.redirect("/admin-dashboard/overview");
});

app.get("/admin-dashboard/overview", isAuthenticated, (req, res) => {
  res.render("admin-dashboard/overview.ejs", { username: req.session.username });
});

app.get('/api/payment-data', isAuthenticated, (req, res) => {
  // Acquire a connection from the pool
  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error acquiring a connection from the pool:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Query to fetch payment data from the "payment" table
    const query = 'SELECT payment_type, SUM(total_amount) AS total_amount FROM payment GROUP BY payment_type';

    connection.query(query, (error, results, fields) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Extract relevant data for the chart
        const labels = results.map(item => item.payment_type);
        const data = results.map(item => item.total_amount);

        // Send the payment data as JSON
        res.json({
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          }],
        });
      }
    });
  });
});

app.get("/admin-dashboard/access-control", isAuthenticated, (req, res) => {
  // Acquire a connection from the pool
  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error acquiring a connection from the pool:", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Query to fetch all staff members from the "users" table
    const query = 'SELECT * FROM users WHERE role = "staff"';

    connection.query(query, (error, results, fields) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
      } else {
        // Render the EJS template with the retrieved staff details
        res.render("admin-dashboard/access-control.ejs", {
          username: req.session.username,
          staff: results, // Pass the staff data to the template
        });
      }
    });
  });
});

app.post('/api/add-user', isAuthenticated, (req, res) => {
  const { firstName, lastName, role, username, password } = req.body;
  // Perform the add user logic here
  pool.query(
    'INSERT INTO users (first_name, last_name, role, username, password) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, role, username, password],
    (error, results) => {
      if (error) {
        console.error('Error adding new user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Redirect to the access-control route after adding the user
        res.redirect("/admin-dashboard/access-control");
      }
    }
  );
});

app.post('/api/update-user/:userId', isAuthenticated, (req, res) => {
  const userId = req.params.userId;
  const { firstName, lastName, role, username, password } = req.body;

  // Perform the update logic here
  pool.query(
    'UPDATE users SET first_name = ?, last_name = ?, role = ?, username = ?, password = ? WHERE user_id = ?',
    [firstName, lastName, role, username, password, userId],
    (error, results) => {
      if (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Send a success response
        res.redirect("/admin-dashboard/access-control");
      }
    }
  );
});

app.get("/admin-dashboard/orders", isAuthenticated, (req, res) => {
  res.render("admin-dashboard/orders.ejs", { username: req.session.username });
});

app.get("/admin-dashboard/report", isAuthenticated, (req, res) => {
  res.render("admin-dashboard/report.ejs", { username: req.session.username });
});

app.get("/admin-dashboard/settings", isAuthenticated, (req, res) => {
  res.render("admin-dashboard/settings.ejs", { username: req.session.username });
});

app.get("/admin-dashboard/data-management", isAuthenticated, (req, res) => {
  pool.getConnection((error, connection) => {
    const query = "SELECT * FROM dishes";
    connection.query(query, (error, results, fields) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
      } else {
        // Render the EJS template with the retrieved dish details
        res.render("admin-dashboard/data-management.ejs", { username: req.session.username, dishes: results });
      }
    });
  })
});

app.delete('/api/remove-dish/:dishId', isAuthenticated, (req, res) => {
  const dishId = req.params.dishId;

  // Perform the removal logic here, for example:
  pool.query('DELETE FROM dishes WHERE dish_id = ?', [dishId], (error, results) => {
    if (error) {
      console.error('Error removing dish:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Send a success response
      res.json({ message: 'Dish removed successfully' });
    }
  });
});

// Add this route to handle dish updates
app.post('/api/update-dish/:dishId', isAuthenticated, (req, res) => {
  const dishId = req.params.dishId;
  const { dishName, price, vegetarian, available } = req.body;

  // Perform the update logic here
  pool.query(
    'UPDATE dishes SET dish_name = ?, price = ?, vegetarian = ?, available = ? WHERE dish_id = ?',
    [dishName, price, vegetarian, available, dishId],
    (error, results) => {
      if (error) {
        console.error('Error updating dish:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Send a success response
        res.redirect("/admin-dashboard/data-management")
      }
    }
  );
});

app.post('/api/add-dish',isAuthenticated, (req, res) => {
  const { dishName, price, vegetarian, available } = req.body;
  pool.query(
    'INSERT INTO dishes (dish_name, price, vegetarian, available) VALUES (?, ?, ?, ?)',
    [dishName, price, vegetarian, available],
    (error, results) => {
      if (error) {
        console.error('Error adding new dish:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Send a success response
        res.redirect("/admin-dashboard/data-management")
      }
    }
  );
})

app.get("/admin-dashboard/transactions", (req, res) => {
  res.redirect("/admin-dashboard/transactions/1");
});

app.get("/admin-dashboard/transactions/:page", isAuthenticated, (req, res) => {
  
  const itemsPerPage = 10;
  const page = req.params.page || 1;
  const offset = (page - 1) * itemsPerPage;

  const query = `
    SELECT payment.payment_id, customer.customer_name, payment.card_number, payment.card_expiration_date, payment.card_holder_name, payment.upi_id, payment.payment_type, 
           payment.total_amount, payment.payment_date, payment.transaction_status
    FROM payment
    JOIN customer ON payment.payment_id = customer.payment_id
    ORDER BY payment.payment_date DESC
    LIMIT ${itemsPerPage} OFFSET ${offset};
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).send('Internal Server Error');
    } else {
      // Calculate the total number of pages
      const queryCount = 'SELECT COUNT(*) AS total FROM payment;';
      pool.query(queryCount, (error, resultCount) => {
        if (error) {
          console.error('Error counting transactions:', error);
          res.status(500).send('Internal Server Error');
        } else {
          const totalTransactions = resultCount[0].total;
          const totalPages = Math.ceil(totalTransactions / itemsPerPage);

          res.render("admin-dashboard/transactions.ejs", { 
            username: req.session.username, 
            transactions: results, 
            currentPage: parseInt(page), 
            totalPages: totalPages 
          });
        }
      });
    }
  });
});




// defines a route to menu
app.get(["/menu/:table_num", "/menu"], (req, res) => {
  // :table_num dictates the number of the table from the QR code
  const tableNumber = req.params.table_num;
  res.render("menu");
});

// defines a route to the payment gateway
app.get("/payment", (req, res) => {
  res.render("payment-gateway");
});

// defines a route to the payment successful page
app.get("/payment-succesful", (req, res) => {
  res.render("payment-successful");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Acquire a connection from the pool
  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error acquiring a connection from the pool:', error);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Query the database to check if the provided credentials are valid
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    connection.query(query, [username, password], (error, results, fields) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
      } else {
        // Check if there is a matching user
        if (results.length > 0) {
          // Authentication successful
          req.session.authenticated = true;
          req.session.username = username;

          const role = results[0].role;
          if (role == "admin") {
            console.log("Authentication successful: Redirected to admin dashboard");
            res.redirect("admin-dashboard");
          } else if (role == "staff") {
            console.log("Authentication successful: Redirected to staff dashboard");
            res.redirect("staff-dashboard");
          }
        } else {
          // Authentication failed
          console.log("Authentication error");
          res.redirect("/login");
        }
      }
    });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      // Redirect to the login page or any other page after logout
      res.redirect("/login");
    }
  });
});

app.get("/staff-dashboard", (req, res) => {
  // Render the staff dashboard view
  res.render("staff-dashboard");
});

// response if the server is successfully running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
