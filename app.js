const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql2 = require("mysql2");
const dotenv = require("dotenv");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const multer = require("multer");
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const fs = require("fs");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const port = 3000;

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

const s3 = new S3Client({
  credentials:{
    accessKeyId: process.env.AWS_keyid,
    secretAccessKey: process.env.AWS_secretkey,
  },
  region: process.env.AWS_region
});

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
  connection.release();
});

const sessionStore = new MySQLStore({
  host: process.env.DBMS_host,
  user: process.env.DBMS_user,
  password: process.env.DBMS_password,
  database: process.env.DBMS_database,
});

sessionStore.createDatabaseTable().then(() => {
  console.log('Session table created successfully.');
}).catch((err) => {
  console.error('Error creating session table:', err);
});

app.use(session({
  secret: '188502',
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    secure: false,
    maxAge: 3600000,
    httpOnly: true,
    sameSite: 'strict',
  },
}));

app.get("/login", (req, res) => {
  res.render("login");
});

const isAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error acquiring a connection from the pool:', error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    connection.query(query, [username, password], (error, results, fields) => {
      connection.release();

      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
      } else {
        if (results.length > 0) {
          req.session.authenticated = true;
          req.session.username = username;
          const role = results[0].role;
          req.session.role = role;
          if (role == "admin") {
            console.log("Authentication successful: Redirected to admin dashboard");
            res.redirect("/admin-dashboard");
          } else if (role == "staff") {
            console.log("Authentication successful: Redirected to staff dashboard");
            res.redirect("/staff-dashboard");
          } else if (role == "superuser") {
            console.log("Authentication successful: Redirected to superuser dashboard");
            res.redirect("/superuser-dashboard");
          }
        } else {
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
      res.redirect("/login");
    }
  });
});

app.post("/api/upload-image", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  else {
    const fileName = randomImageName();
    const params = {
      Bucket: process.env.AWS_bucket,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      await s3.send(new PutObjectCommand(params));

      res.json({ fileName });
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});


app.get("/admin-dashboard", (req, res) => {
  res.redirect("/admin-dashboard/overview");
});

app.get("/admin-dashboard/overview", isAuthenticated, (req, res) => {
  // Query to fetch payment type counts
  const paymentTypeQuery = `
    SELECT 
      payment_type,
      COUNT(*) AS count
    FROM 
      payment
    GROUP BY 
      payment_type;
  `;

  // Query to fetch count of pending orders
  const pendingOrdersQuery = `
    SELECT 
      COUNT(*) AS count
    FROM 
      customer
    WHERE 
      order_status = 'Preparing';
  `;

  // Query to fetch total amount from the current month
  const totalAmountCurrentMonthQuery = `
    SELECT 
      SUM(total_amount) AS totalAmount
    FROM 
      payment
    WHERE 
      MONTH(payment_date) = MONTH(CURDATE());
  `;

  // Query to fetch count of sold dishes by category this month
  const soldDishesByCategoryQuery = `
    SELECT 
      c.category,
      COUNT(*) AS count
    FROM 
      kitchen k
    JOIN 
      dishes d ON k.dish_id = d.dish_id
    JOIN 
      categories c ON d.dish_id = c.dish_id
    WHERE 
      MONTH(k.order_id) = MONTH(CURDATE())
    GROUP BY 
      c.category;
  `;

  // Query to fetch total amount per month for the last 8 months
  const totalAmountLast8MonthsQuery = `
  SELECT 
    DATE_FORMAT(payment_date, '%Y-%m') AS month,
    SUM(total_amount) AS totalAmount
  FROM 
    payment
  WHERE 
    payment_date >= CURDATE() - INTERVAL 8 MONTH
    AND payment_date < CURDATE() -- Add this condition to limit to the last 8 months
  GROUP BY 
    MONTH(payment_date), YEAR(payment_date), DATE_FORMAT(payment_date, '%Y-%m')
  ORDER BY 
    YEAR(payment_date), MONTH(payment_date);
`;

  // Execute the queries using the connection pool
  pool.query(paymentTypeQuery, (error1, doughnutData) => {
    if (error1) {
      console.error("Error executing MySQL query for payment types:", error1);
      res.status(500).send("Internal Server Error");
      return;
    }

    pool.query(pendingOrdersQuery, (error2, pendingOrdersData) => {
      if (error2) {
        console.error("Error executing MySQL query for pending orders:", error2);
        res.status(500).send("Internal Server Error");
        return;
      }

      pool.query(totalAmountCurrentMonthQuery, (error3, totalAmountCurrentMonthData) => {
        if (error3) {
          console.error("Error executing MySQL query for total amount current month:", error3);
          res.status(500).send("Internal Server Error");
          return;
        }

        pool.query(soldDishesByCategoryQuery, (error4, soldDishesByCategoryData) => {
          if (error4) {
            console.error("Error executing MySQL query for sold dishes by category:", error4);
            res.status(500).send("Internal Server Error");
            return;
          }

          pool.query(totalAmountLast8MonthsQuery, (error5, totalAmountLast8MonthsData) => {
            if (error5) {
              console.error("Error executing MySQL query for total amount last 8 months:", error5);
              res.status(500).send("Internal Server Error");
              return;
            }
            console.log(totalAmountLast8MonthsData);
            // Render the EJS template with the query results
            res.render("admin-dashboard/overview.ejs", {
              username: req.session.username,
              role: req.session.role,
              doughnutData: doughnutData,
              pendingOrdersData: pendingOrdersData[0],
              totalAmountCurrentMonthData: totalAmountCurrentMonthData[0],
              soldDishesByCategoryData: soldDishesByCategoryData,
              totalAmountLast8MonthsData: totalAmountLast8MonthsData
            });
          });
        });
      });
    });
  });
});



app.get("/admin-dashboard/access-control", isAuthenticated, (req, res) => {
  if (req.session.role === 'superuser') {
    return res.redirect("/superuser-dashboard/access-control");
  }
  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error acquiring a connection from the pool:", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const query = 'SELECT * FROM users WHERE role = "staff"';

    connection.query(query, (error, results, fields) => {
      connection.release();

      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
      } else {
        res.render("admin-dashboard/access-control.ejs", {
          username: req.session.username,
          staff: results,
          role: req.session.role
        });
      }
    });
  });
});

app.get("/admin-dashboard/orders", (req, res) => {
  res.redirect("/admin-dashboard/orders/1");
});

app.get("/admin-dashboard/orders/:page", isAuthenticated, (req, res) => {
  const itemsPerPage = 10;
  const page = req.params.page;
  const offset = (page - 1) * itemsPerPage;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error acquiring a connection from the pool:", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const countQuery = 'SELECT COUNT(DISTINCT customer.order_id) AS total FROM customer';

    connection.query(countQuery, (error, resultCount) => {
      if (error) {
        console.error("Error counting orders:", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      const totalOrders = resultCount[0].total;

      const query = `
        SELECT 
          customer.order_id, 
          customer.table_num, 
          customer.order_date, 
          customer.order_status, 
          GROUP_CONCAT(CONCAT(dishes.dish_name, ' x ', kitchen.quantity)) as ordered_dishes
        FROM customer
        LEFT JOIN kitchen ON customer.order_id = kitchen.order_id
        LEFT JOIN dishes ON kitchen.dish_id = dishes.dish_id
        GROUP BY customer.order_id
        ORDER BY customer.order_date DESC
        LIMIT ${itemsPerPage} OFFSET ${offset};
      `;

      connection.query(query, (error, results, fields) => {
        connection.release();

        if (error) {
          console.error("Error querying database:", error);
          res.status(500).send("Internal Server Error");
        } else {
          results.forEach(result => {
            result.order_date = formatDateTime(result.order_date);
          });

          res.render("admin-dashboard/orders.ejs", { 
            username: req.session.username, 
            orders: results,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalOrders / itemsPerPage),
            role: req.session.role
          });
        }
      });
    });
  });
});

app.get("/admin-dashboard/report", isAuthenticated, (req, res) => {
  res.render("admin-dashboard/report.ejs", { username: req.session.username, role: req.session.role });
});

app.get("/admin-dashboard/settings", isAuthenticated, (req, res) => {
  res.render("admin-dashboard/settings.ejs", { username: req.session.username, role: req.session.role });
});

app.get("/admin-dashboard/data-management", isAuthenticated, (req, res) => {
  pool.getConnection((error, connection) => {
    const query = "SELECT * FROM dishes ORDER BY dish_name";

    connection.query(query, (error, results, fields) => {
      connection.release();

      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
      } else {
        res.render("admin-dashboard/data-management.ejs", { username: req.session.username, dishes: results, role: req.session.role });
      }
    });
  })
});

app.get("/admin-dashboard/transactions", (req, res) => {
  res.redirect("/admin-dashboard/transactions/1");
});

app.get("/admin-dashboard/transactions/:page", isAuthenticated, (req, res) => {
  
  const itemsPerPage = 10;
  const page = req.params.page || 1;
  const offset = (page - 1) * itemsPerPage;

  const query = `
    SELECT payment.payment_id, customer.customer_name, payment.card_number, payment.card_expiration_date, payment.card_holder_name, payment.upi_id, payment.payment_type, 
           payment.total_amount, payment.payment_date
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
            totalPages: totalPages,
            role: req.session.role
          });
        }
      });
    }
  });
});

app.get("/staff-dashboard", (req, res) => {
  res.redirect("/staff-dashboard/overview");
});

app.get("/staff-dashboard/overview", isAuthenticated, (req, res) => {
  res.render("staff-dashboard/overview.ejs", { username: req.session.username, role: req.session.role });
});

app.get("/superuser-dashboard/data-management", isAuthenticated, (req, res) => {
  res.redirect("/admin-dashboard/data-management");
});

app.get("/staff-dashboard/data-management", isAuthenticated, (req, res) => {
  pool.getConnection((error, connection) => {
    const query = "SELECT * FROM dishes ORDER BY dish_name";
    connection.query(query, (error, results, fields) => {
      connection.release();

      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
      } else {
        res.render("staff-dashboard/data-management.ejs", { username: req.session.username, dishes: results , role: req.session.role });
      }
    });
  })
});

app.get("/staff-dashboard/orders", (req, res) => {
  res.redirect("/staff-dashboard/orders/1");
});

app.get("/staff-dashboard/orders/:page", isAuthenticated, (req, res) => {
  const itemsPerPage = 10;
  const page = req.params.page;
  const offset = (page - 1) * itemsPerPage;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error acquiring a connection from the pool:", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const countQuery = 'SELECT COUNT(DISTINCT customer.order_id) AS total FROM customer';

    connection.query(countQuery, (error, resultCount) => {
      if (error) {
        console.error("Error counting orders:", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      const totalOrders = resultCount[0].total;

      const query = `
        SELECT 
          customer.order_id, 
          customer.table_num, 
          customer.order_date, 
          customer.order_status, 
          GROUP_CONCAT(CONCAT(dishes.dish_name, ' x ', kitchen.quantity)) as ordered_dishes
        FROM customer
        LEFT JOIN kitchen ON customer.order_id = kitchen.order_id
        LEFT JOIN dishes ON kitchen.dish_id = dishes.dish_id
        GROUP BY customer.order_id
        ORDER BY customer.order_date DESC
        LIMIT ${itemsPerPage} OFFSET ${offset};
      `;

      connection.query(query, (error, results, fields) => {
        connection.release();

        if (error) {
          console.error("Error querying database:", error);
          res.status(500).send("Internal Server Error");
        } else {
          results.forEach(result => {
            result.order_date = formatDateTime(result.order_date);
          });

          res.render("staff-dashboard/orders.ejs", { 
            username: req.session.username, 
            orders: results,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalOrders / itemsPerPage),
            role: req.session.role
          });
        }
      });
    });
  });
});

app.get("/staff-dashboard/settings", isAuthenticated, (req, res) => {
  res.render("staff-dashboard/settings.ejs", { username: req.session.username, role: req.session.role });
});

app.get("/index", (req, res) => {
  res.render("home");
});

app.get(["/", "/home"], (req, res) => {
  res.redirect("/index");
});

app.get("/superuser-dashboard", (req, res) => {
  res.redirect("/superuser-dashboard/overview");
});

app.get("/superuser-dashboard/overview", isAuthenticated, (req, res) => {
  // Query to fetch payment type counts
  const paymentTypeQuery = `
    SELECT 
      payment_type,
      COUNT(*) AS count
    FROM 
      payment
    GROUP BY 
      payment_type;
  `;

  // Query to fetch count of pending orders
  const pendingOrdersQuery = `
    SELECT 
      COUNT(*) AS count
    FROM 
      customer
    WHERE 
      order_status = 'Preparing';
  `;

  // Query to fetch total amount from the current month
  const totalAmountCurrentMonthQuery = `
    SELECT 
      SUM(total_amount) AS totalAmount
    FROM 
      payment
    WHERE 
      MONTH(payment_date) = MONTH(CURDATE());
  `;

  // Query to fetch count of sold dishes by category this month
  const soldDishesByCategoryQuery = `
    SELECT 
      c.category,
      COUNT(*) AS count
    FROM 
      kitchen k
    JOIN 
      dishes d ON k.dish_id = d.dish_id
    JOIN 
      categories c ON d.dish_id = c.dish_id
    WHERE 
      MONTH(k.order_id) = MONTH(CURDATE())
    GROUP BY 
      c.category;
  `;

  // Query to fetch total amount per month for the last 8 months
  const totalAmountAllMonthsQuery = `
  SELECT 
    DATE_FORMAT(payment_date, '%Y-%m') AS month,
    SUM(total_amount) AS totalAmount
  FROM 
    payment
  GROUP BY 
    MONTH(payment_date), YEAR(payment_date), DATE_FORMAT(payment_date, '%Y-%m')
  ORDER BY 
    YEAR(payment_date) , MONTH(payment_date) ;
`;


  // Execute the queries using the connection pool
  pool.query(paymentTypeQuery, (error1, doughnutData) => {
    if (error1) {
      console.error("Error executing MySQL query for payment types:", error1);
      res.status(500).send("Internal Server Error");
      return;
    }

    pool.query(pendingOrdersQuery, (error2, pendingOrdersData) => {
      if (error2) {
        console.error("Error executing MySQL query for pending orders:", error2);
        res.status(500).send("Internal Server Error");
        return;
      }

      pool.query(totalAmountCurrentMonthQuery, (error3, totalAmountCurrentMonthData) => {
        if (error3) {
          console.error("Error executing MySQL query for total amount current month:", error3);
          res.status(500).send("Internal Server Error");
          return;
        }

        pool.query(soldDishesByCategoryQuery, (error4, soldDishesByCategoryData) => {
          if (error4) {
            console.error("Error executing MySQL query for sold dishes by category:", error4);
            res.status(500).send("Internal Server Error");
            return;
          }

          pool.query(totalAmountAllMonthsQuery, (error5, totalAmountLast8MonthsData) => {
            if (error5) {
              console.error("Error executing MySQL query for total amount last 8 months:", error5);
              res.status(500).send("Internal Server Error");
              return;
            }
            console.log(totalAmountLast8MonthsData);
            // Render the EJS template with the query results
            res.render("admin-dashboard/overview.ejs", {
              username: req.session.username,
              role: req.session.role,
              doughnutData: doughnutData,
              pendingOrdersData: pendingOrdersData[0],
              totalAmountCurrentMonthData: totalAmountCurrentMonthData[0],
              soldDishesByCategoryData: soldDishesByCategoryData,
              totalAmountLast8MonthsData: totalAmountLast8MonthsData
            });
          });
        });
      });
    });
  });
});


app.get("/superuser-dashboard/access-control", isAuthenticated, (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error acquiring a connection from the pool:", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const query = 'SELECT * FROM users WHERE role != "superuser" ORDER BY CASE WHEN role = "admin" THEN 0 ELSE 1 END, role';

    connection.query(query, (error, results, fields) => {
      connection.release();

      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
      } else {
        res.render("admin-dashboard/superuser-access-control.ejs", {
          username: req.session.username,
          staff: results,
          role: req.session.role
        });
      }
    });
  });
});

app.get('/api/payment-data', isAuthenticated, (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error acquiring a connection from the pool:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const query = 'SELECT payment_type, SUM(total_amount) AS total_amount FROM payment GROUP BY payment_type';

    connection.query(query, (error, results, fields) => {
      connection.release();

      if (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const labels = results.map(item => item.payment_type);
        const data = results.map(item => item.total_amount);

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

app.post('/api/add-user', isAuthenticated, (req, res) => {
  const { firstName, lastName, role, username, password } = req.body;
  pool.query(
    'INSERT INTO users (first_name, last_name, role, username, password) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, role, username, password],
    (error, results) => {
      if (error) {
        console.error('Error adding new user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        
        const referer = req.get('referer');
        res.redirect(referer);
      }
    }
  );
});

app.post('/api/add-staff', isAuthenticated, (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  const role ='staff';
  pool.query(
    'INSERT INTO users (first_name, last_name, role, username, password) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, role, username, password],
    (error, results) => {
      if (error) {
        console.error('Error adding new staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const referer = req.get('referer');
        res.redirect(referer);
      }
    }
  );
});

app.post('/api/update-user/:userId', isAuthenticated, (req, res) => {
  const userId = req.params.userId;
  const { firstName, lastName, role, username, password } = req.body;

  pool.query(
    'UPDATE users SET first_name = ?, last_name = ?, role = ?, username = ?, password = ? WHERE user_id = ?',
    [firstName, lastName, role, username, password, userId],
    (error, results) => {
      if (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const referer = req.get('referer');
        res.redirect(referer);
      }
    }
  );
});

app.post('/api/update-staff/:userId', isAuthenticated, (req, res) => {
  const userId = req.params.userId;
  const { firstName, lastName, username, password } = req.body;

  pool.query(
    'UPDATE users SET first_name = ?, last_name = ?, username = ?, password = ? WHERE user_id = ?',
    [firstName, lastName, username, password, userId],
    (error, results) => {
      if (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const referer = req.get('referer');
        res.redirect(referer);
      }
    }
  );
});

app.delete('/api/remove-user/:userId', isAuthenticated, (req, res) => {
  const userId = req.params.userId;

  pool.query('DELETE FROM users WHERE user_id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error removing user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      
      res.json({ message: 'User removed successfully' });
    }
  });
});

function formatDateTime(dateTimeString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateTime = new Date(dateTimeString);
  const formattedDateTime = dateTime.toLocaleString('en-GB', options);
  return formattedDateTime.replace(/\//g, '-');
}

app.post('/api/update-order-status/:orderId', isAuthenticated, (req, res) => {
  const orderId = req.params.orderId;
  const { orderStatus } = req.body;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error acquiring a connection from the pool:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const query = 'UPDATE customer SET order_status = ? WHERE order_id = ?';
    connection.query(query, [orderStatus, orderId], (error, results) => {
      connection.release();

      if (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const referer = req.get('referer');
        res.redirect(referer);
      }
    });
  });
});

app.delete('/api/remove-dish/:dishId', isAuthenticated, (req, res) => {
  const dishId = req.params.dishId;
  const checkQuery = 'SELECT * FROM kitchen WHERE dish_id = ? LIMIT 1';
  pool.query(checkQuery, [dishId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking foreign key reference:', checkError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (checkResults.length > 0) {
      res.status(400).json({ error: 'Cannot remove dish. It is referenced in the kitchen table.' });
    } else {
      const deleteQuery = 'DELETE FROM dishes WHERE dish_id = ?';
      pool.query(deleteQuery, [dishId], (deleteError, deleteResults) => {
        if (deleteError) {
          console.error('Error removing dish:', deleteError);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ message: 'Dish removed successfully' });
        }
      });
    }
  });
});

app.post('/api/update-dish/:dishId', isAuthenticated, (req, res) => {
  const dishId = req.params.dishId;
  const { dishName, price, vegetarian, available, dishDescription, dishPhoto, calories, protein, fat, carb } = req.body;

  pool.query(
    'SELECT dish_photo FROM dishes WHERE dish_id = ?',
    [dishId],
    (selectError, selectResults) => {
      if (selectError) {
        console.error('Error selecting dish_photo:', selectError);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const currentDishPhoto = selectResults[0].dish_photo;

        pool.query(
          'UPDATE dishes SET dish_name = ?, price = ?, vegetarian = ?, available = ?, dish_description = ?, dish_photo = ?, calories = ?, protein = ?, fat = ?, carb = ? WHERE dish_id = ?',
          [dishName, price, vegetarian, available, dishDescription, dishPhoto, calories, protein, fat, carb, dishId],
          (updateError, updateResults) => {
            if (updateError) {
              console.error('Error updating dish:', updateError);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              if (currentDishPhoto && currentDishPhoto !== dishPhoto) {
                fs.unlink(path.join(__dirname, "public/images/uploads", currentDishPhoto), (unlinkError) => {
                  if (unlinkError) {
                    console.error('Error deleting old image file:', unlinkError);
                  } else {
                    console.log('Old image file deleted successfully');
                  }
                });
              }

              const referer = req.get('referer');
              res.redirect(referer);
            }
          }
        );
      }
    }
  );
});

function generatePDFReport(data) {
  const fileName = `sales_report_${Date.now()}.pdf`;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Sales Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });
  doc.setFontSize(12);

  const rows = data.map(sale => [sale.payment_id, sale.payment_date, sale.customer_name, sale.email, sale.payment_type, sale.total_amount]);

  const totalAmounts = {
    'Credit card': 0,
    'Debit card': 0,
    'UPI': 0,
    'Cash': 0,
  };

  data.forEach(sale => {
    totalAmounts[sale.payment_type] += parseFloat(sale.total_amount);
  });

  const overallTotalAmount = Object.values(totalAmounts).reduce((sum, amount) => sum + amount, 0);

  doc.autoTable({
    head: [['Payment ID', 'Payment Date', 'Customer Name', 'Email', 'Payment Type', 'Amount']],
    body: rows,
    startY: 25,
  });

  Object.entries(totalAmounts).forEach(([paymentType, totalAmount]) => {
    doc.autoTable({
      head: [[`Total Amount (${paymentType})`]],
      body: [['Rs. ' + totalAmount.toFixed(2)]],
      startY: doc.autoTable.previous.finalY + 10,
    });
  });

  doc.autoTable({
    head: [['Overall Total Amount']],
    body: [['Rs. ' + overallTotalAmount.toFixed(2)]],
    startY: doc.autoTable.previous.finalY + 10,
  });

  doc.save(fileName);

  return fileName;
}


app.post('/api/generate-sales-report', async (req, res) => {
  try {
    const dateRange = req.body.dateRangePicker;
    let startEndDates = dateRange.split(" to ");
    const startDate = new Date(startEndDates[0]);
    const endDate = new Date(startEndDates[1]);
    console.log(startDate);

    const query = `
      SELECT
          p.payment_id,
          p.payment_date,
          c.customer_name,
          c.email,
          p.payment_type,
          p.total_amount
      FROM
          payment p
      JOIN
          customer c ON p.payment_id = c.payment_id
      WHERE
          p.payment_date BETWEEN ? AND ?;
    `;

    const results = await new Promise((resolve, reject) => {
      pool.query(query, [startDate, endDate], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const pdfFilePath = generatePDFReport(results);

    res.download(pdfFilePath, 'sales_report.pdf', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Internal Server Error');
      } else {
        fs.unlinkSync(pdfFilePath);
      }
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/add-dish',isAuthenticated, (req, res) => {
  const { dishName, price, vegetarian, available, dishDescription, dishPhoto, calories, protein, fat, carb } = req.body;
  pool.query(
    'INSERT INTO dishes (dish_name, price, vegetarian, available, dish_description, dish_photo, calories, protein, fat, carb) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [dishName, price, vegetarian, available, dishDescription, dishPhoto, calories, protein, fat, carb],
    (error, results) => {
      if (error) {
        console.error('Error adding new dish:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const referer = req.get('referer');
        res.redirect(referer);
      }
    }
  );
})

app.get("/menu/:table_num", (req, res) => {
  const tableNumber = req.params.table_num;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error acquiring a connection from the pool:", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const dishesQuery = "SELECT * FROM dishes";

    const restaurantQuery = "SELECT * FROM restaurant";

    const categoriesQuery = "SELECT * FROM categories";

    connection.query(dishesQuery, (error, dishesResults) => {
      if (error) {
        console.error("Error querying dishes:", error);
        connection.release();
        res.status(500).send("Internal Server Error");
        return;
      }

      connection.query(restaurantQuery, (error, restaurantResults) => {
        if (error) {
          console.error("Error querying restaurant:", error);
          connection.release();
          res.status(500).send("Internal Server Error");
          return;
        }

        connection.query(categoriesQuery, (error, categoriesResults) => {
          if (error) {
            console.error("Error querying categories:", error);
            connection.release();
            res.status(500).send("Internal Server Error");
            return;
          }

          connection.release();

          res.render("menu", {
            dishes: dishesResults,
            restaurant: restaurantResults[0],
            categories: categoriesResults,
            table_num: tableNumber,
            role: req.session.role
          });
        });
      });
    });
  });
});

app.post('/api/checkout', (req, res) => {
  const { tableNum, cart, totalPrice } = req.body;
  console.log(cart);
  res.render("checkout", {
      tableNum: tableNum,
      cart: cart,
      totalPrice: totalPrice,
  });
});

app.post("/api/place-order", (req, res) => {
  const { tableNum, cart, totalPrice, customerName, email, paymentMethod, upiId, cardHolderName, cardNumber, expiryDate } = req.body;
  const parts = expiryDate.split('/');
  const formattedExpiryDate = parts[1] + '-' + parts[0] + '-01';

  const paymentQuery = "INSERT INTO payment (payment_type, total_amount, payment_date, card_number, card_expiration_date, card_holder_name, upi_id) VALUES (?, ?, NOW(), ?, ?, ?, ?)";
  pool.query(paymentQuery, [paymentMethod, totalPrice, cardNumber, formattedExpiryDate, cardHolderName, upiId], (paymentError, paymentResults) => {
    if (paymentError) {
      console.error("Error inserting payment details:", paymentError);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const paymentId = paymentResults.insertId;

    pool.getConnection((orderError, connection) => {
      if (orderError) {
        console.error("Error acquiring a connection from the pool:", orderError);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const orderQuery =
        "INSERT INTO customer (payment_id, customer_name, email, order_date, order_status, table_num) VALUES (?, ?, ?, NOW(), 'Preparing', ?)";
      connection.query(orderQuery, [paymentId, customerName, email, tableNum ], (orderError, orderResults) => {
        if (orderError) {
          console.error("Error inserting order details:", orderError);
          connection.release();
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        const orderId = orderResults.insertId;

        const cartObj = JSON.parse(cart);
        console.log(cartObj);

        Object.entries(cartObj).forEach(([dishId, quantity]) => {
          const kitchenQuery =
            "INSERT INTO kitchen (order_id, dish_id, quantity) VALUES (?, ?, ?)";
          connection.query(
            kitchenQuery,
            [orderId, dishId, quantity],
            (kitchenError) => {
              if (kitchenError) {
                console.error("Error inserting kitchen details:", kitchenError);
                connection.release();
                res.status(500).json({ error: "Internal Server Error" });
                return;
              }
            }
          );
        });
        

        connection.release();

        res.render("payment-success");
      });
    });
  });
});

app.get("/staff-dashboard", (req, res) => {
  res.render("staff-dashboard");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});