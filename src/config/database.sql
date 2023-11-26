CREATE DATABASE IF NOT EXISTS dinescan;
USE dinescan;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') NOT NULL,
  UNIQUE KEY unique_username_password (username, password)
);

CREATE TABLE IF NOT EXISTS dishes (
  dish_id INT AUTO_INCREMENT PRIMARY KEY,
  dish_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  vegetarian BOOLEAN NOT NULL,
  available INT NOT NULL
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

