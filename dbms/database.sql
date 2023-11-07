CREATE DATABASE IF NOT EXISTS dinescan;
USE dinescan;

CREATE TABLE IF NOT EXISTS customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number INT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date DATE NOT NULL,
    order_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE IF NOT EXISTS dishes (
    dish_id INT AUTO_INCREMENT PRIMARY KEY,
    dish_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    vegetarian BOOLEAN NOT NULL,
    available BOOLEAN NOT NULL
);

-- sample data
INSERT INTO dishes (dish_name, price, vegetarian, available)
VALUES
    ('Spaghetti Carbonara', 12.99, 0, 1),
    ('Margherita Pizza', 10.50, 1, 1),
    ('Chicken Alfredo', 14.75, 0, 1),
    ('Vegetable Stir-Fry', 11.25, 1, 1),
    ('Grilled Salmon', 16.99, 0, 0),
    ('Caesar Salad', 8.75, 1, 1);
--

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    dish_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (dish_id) REFERENCES dishes(dish_id)
);

