// include the necessary libraries
const express = require('express');
const path = require('path');

// define constants
const app = express();
const port = 3000;

// set up a static directory for storing assets
app.use(express.static(path.join(__dirname, 'public')));

// defines a route to the index
app.get(['/','/index'], (req, res) => {
  // path.join creates a platform-independent path to the HTML file
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// defines a route to the menu
app.get('/menu/:table_num', (req, res) => {
  // :table_num dictates the number of the table from the QR code
  const tableNumber = req.params.table_num;
  const menuPath = path.join(__dirname, 'views', 'menu.html');
  res.sendFile(menuPath);
});

// defines a route to the payment gateway
app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'payment_gateway.html'));
});

// response if the server is successfully running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
