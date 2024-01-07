-- database design --

CREATE DATABASE IF NOT EXISTS dinescan;
USE dinescan;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'superuser') NOT NULL,
  profile_photo TEXT,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  UNIQUE KEY unique_username_password (username, password)
);

-- Dishes table
CREATE TABLE IF NOT EXISTS dishes (
  dish_id INT AUTO_INCREMENT PRIMARY KEY,
  dish_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  vegetarian BOOLEAN NOT NULL,
  available INT NOT NULL,
  dish_description TEXT,
  dish_photo TEXT,
  calories INT,
  protein INT,
  fat INT,
  carb INT
);

-- Payment table
CREATE TABLE IF NOT EXISTS payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_type ENUM('Credit card', 'Debit card', 'UPI', 'Cash') NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_date DATETIME NOT NULL,
  card_number VARCHAR(19),
  card_expiration_date DATE,
  card_holder_name VARCHAR(255),
  upi_id VARCHAR(255)
);

-- Customer table
CREATE TABLE IF NOT EXISTS customer (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  order_date DATETIME NOT NULL,
  order_status ENUM('Preparing', 'Completed') NOT NULL,
  table_num INT NOT NULL,
  FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
);

-- Kitchen table
CREATE TABLE IF NOT EXISTS kitchen (
  order_id INT NOT NULL,
  dish_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES customer(order_id),
  FOREIGN KEY (dish_id) REFERENCES dishes(dish_id)
);

-- Restaurant table
CREATE TABLE restaurant (
    restaurant_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    restaurant_phone_num VARCHAR(20),
    restaurant_email VARCHAR(255),
    description TEXT
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  dish_id INT NOT NULL,
  category VARCHAR(255) NOT NULL,
  FOREIGN KEY (dish_id) REFERENCES dishes(dish_id),
  UNIQUE KEY unique_dish_category (dish_id, category)
);

-- Veg, Non-veg, Appetizers, Soups, Salads, Noodles and rice,
-- Curries, Sushi and sashimi, Grills and barbeque, Seafood, Deserts, Beverages