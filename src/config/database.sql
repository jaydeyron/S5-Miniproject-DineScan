-- Create the 'dinescan' database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dinescan;
USE dinescan;

-- Users table for authentication
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') NOT NULL
);

-- Dishes table
CREATE TABLE dishes (
  dish_id INT AUTO_INCREMENT PRIMARY KEY,
  dish_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  vegetarian BOOLEAN NOT NULL,
  available INT NOT NULL
);

-- Payment table
CREATE TABLE payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_type VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer table
CREATE TABLE customer (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone_num VARCHAR(20) NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  table_num INT NOT NULL,
  FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
);

-- Kitchen table
CREATE TABLE kitchen (
  order_id INT NOT NULL,
  dish_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, dish_id),
  FOREIGN KEY (order_id) REFERENCES customer(order_id),
  FOREIGN KEY (dish_id) REFERENCES dishes(dish_id)
);

-------------------
--  Sample data  --
-------------------

-- Inserting into Users table
-- INSERT INTO users (username, password, role) VALUES
--   ('jay', '188502', 'admin'),
--   ('yohanjose', '69420', 'staff');


