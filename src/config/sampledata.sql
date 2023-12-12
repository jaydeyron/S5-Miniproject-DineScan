-- Sample data for users table
INSERT INTO users (username, password, role)
VALUES
  ('Jay', '188502', 'admin'),
  ('Yohan', 'Thundil', 'staff');

-- Sample data for dishes table
INSERT INTO dishes (dish_name, price, vegetarian, available)
VALUES
  ('Spaghetti Bolognese', 12.99, false, 1),
  ('Margherita Pizza', 9.99, true, 1),
  ('Caesar Salad', 8.49, true, 1),
  ('Grilled Salmon', 15.99, false, 1);

-- Sample data for payment table
INSERT INTO payment (payment_type, total_amount) VALUES
('UPI', 2567.00),
('Credit/Debit Card', 1250.00),
('Cash', 899.00),
('UPI', 2750.00),
('Credit/Debit Card', 1776.00),
('Cash', 490.00),
('UPI', 2201.00),
('Credit/Debit Card', 2980.00),
('Cash', 1430.00),
('UPI', 2888.00),
('Credit/Debit Card', 1111.00),
('Cash', 749.00),
('UPI', 2456.00),
('Credit/Debit Card', 2384.00),
('Cash', 1905.00),
('UPI', 2677.00),
('Credit/Debit Card', 2230.00),
('Cash', 1520.00),
('UPI', 2789.00),
('Credit/Debit Card', 1934.00),
('Cash', 750.00),
('UPI', 2998.00),
('Credit/Debit Card', 2610.00),
('Cash', 1187.00),
('UPI', 2654.00),
('Credit/Debit Card', 2572.00),
('Cash', 2207.00),
('UPI', 2995.00),
('Credit/Debit Card', 2921.00),
('Cash', 2880.00),
('UPI', 2760.00),
('Credit/Debit Card', 2425.00),
('Cash', 988.00),
('UPI', 2683.00),
('Credit/Debit Card', 2320.00),
('Cash', 1056.00),
('UPI', 2475.00),
('Credit/Debit Card', 2113.00),
('Cash', 925.00),
('UPI', 2272.00),
('Credit/Debit Card', 1837.00),
('Cash', 1566.00),
('UPI', 2320.00),
('Credit/Debit Card', 2222.00),
('Cash', 1710.00),
('UPI', 2829.00),
('Credit/Debit Card', 2066.00),
('Cash', 1265.00),
('UPI', 2534.00),
('Credit/Debit Card', 1700.00),
('Cash', 1305.00),
('UPI', 2223.00),
('Credit/Debit Card', 1296.00),
('Cash', 1100.00),
('UPI', 2367.00),
('Credit/Debit Card', 1975.00),
('Cash', 1620.00),
('UPI', 2450.00),
('Credit/Debit Card', 1332.00),
('Cash', 770.00),
('UPI', 2950.00),
('Credit/Debit Card', 2021.00),
('Cash', 1220.00),
('UPI', 2236.00),
('Credit/Debit Card', 1601.00),
('Cash', 990.00),
('UPI', 2578.00),
('Credit/Debit Card', 2777.00),
('Cash', 2450.00),
('UPI', 2333.00),
('Credit/Debit Card', 2555.00),
('Cash', 1168.00),
('UPI', 2876.00),
('Credit/Debit Card', 1434.00),
('Cash', 980.00),
('UPI', 2543.00),
('Credit/Debit Card', 2321.00),
('Cash', 2020.00),
('UPI', 2845.00),
('Credit/Debit Card', 1460.00),
('Cash', 960.00),
('UPI', 2421.00),
('Credit/Debit Card', 1988.00),
('Cash', 1020.00);

-- Sample data for customer table
INSERT INTO customer (payment_id, customer_name, phone_num, order_date, table_num)
VALUES
  (1, 'John Doe', 1234567890, UNIX_TIMESTAMP(NOW()), 5),
  (2, 'Jane Smith', 9876543210, UNIX_TIMESTAMP(NOW()), 3),
  (3, 'Bob Johnson', 5551234567, UNIX_TIMESTAMP(NOW()), 7);

-- Sample data for kitchen table
INSERT INTO kitchen (order_id, dish_id, quantity)
VALUES
  (1, 1, 2),
  (1, 2, 1),
  (2, 3, 2),
  (3, 4, 1);



INSERT INTO dishes (dish_name, price, vegetarian, available) VALUES
('Butter Chicken', 300.00, false, 25),
('Paneer Tikka', 200.00, true, 20),
('Dal Tadka', 150.00, true, 18),
('Chicken Biryani', 350.00, false, 15),
('Vegetable Biryani', 250.00, true, 22);

COMMIT;