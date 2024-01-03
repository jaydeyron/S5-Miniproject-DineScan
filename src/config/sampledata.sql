-- Sample data for users table
INSERT INTO users (username, password, role, first_name, last_name, email)
VALUES
  ('yohan', 'thundil', 'admin', 'Yohan', 'Jose', 'thundil.yohan@hub.com'),
  ('johnsmith', 'johnpassword', 'staff', 'John', 'Smith', 'john.smith@example.com'),
  ('janedoe', 'janepassword', 'staff', 'Jane', 'Doe', 'jane.doe@example.com'),
  ('michaeljones', 'michaelpassword', 'staff', 'Michael', 'Jones', 'michael.jones@example.com'),
  ('sarahwilson', 'sarahpassword', 'staff', 'Sarah', 'Wilson', 'sarah.wilson@example.com'),
  ('davidmiller', 'davidpassword', 'staff', 'David', 'Miller', 'david.miller@example.com'),
  ('emilythomas', 'emilypassword', 'staff', 'Emily', 'Thomas', 'emily.thomas@example.com'),
  ('kevinbrown', 'kevinpassword', 'staff', 'Kevin', 'Brown', 'kevin.brown@example.com'),
  ('laurawhite', 'laurapassword', 'staff', 'Laura', 'White', 'laura.white@example.com'),
  ('ryanjackson', 'ryanpassword', 'staff', 'Ryan', 'Jackson', 'ryan.jackson@example.com'),
  ('oliviaadams', 'oliviapassword', 'admin', 'Olivia', 'Adams', 'olivia.adams@example.com'),
  ('abhaysooraj', 'anadearmas', 'staff', 'Abhay', 'Sooraj', 'abhay.s00raj@example.com'),
  ('jay', '188502', 'superuser', 'Jay', 'C', 'jay.deyron@example.com');

-- Sample data for dishes table
INSERT INTO dishes (dish_name, price, vegetarian, available)
VALUES
  ('Paneer Tikka', 150.00, true, 30),
  ('Chicken Biryani', 200.00, false, 25),
  ('Masala Dosa', 100.00, true, 40),
  ('Butter Chicken', 180.00, false, 20),
  ('Samosa', 30.00, true, 50),
  ('Chole Bhature', 120.00, true, 35),
  ('Rajma Chawal', 110.00, true, 30),
  ('Aloo Gobi', 140.00, true, 25),
  ('Palak Paneer', 160.00, true, 30),
  ('Fish Curry', 250.00, false, 15),
  ('Dhokla', 80.00, true, 25),
  ('Hyderabadi Biryani', 220.00, false, 20),
  ('Idli Sambar', 90.00, true, 40),
  ('Chicken Curry', 190.00, false, 18),
  ('Pav Bhaji', 110.00, true, 35),
  ('Puliyodarai', 95.00, true, 30),
  ('Kadai Paneer', 170.00, true, 28),
  ('Mysore Pak', 60.00, true, 45),
  ('Dal Makhani', 150.00, true, 30),
  ('Rasam', 70.00, true, 42),
  ('Tandoori Roti', 15.00, true, 60),
  ('Neer Dosa', 80.00, true, 35),
  ('Chicken 65', 160.00, false, 25),
  ('Gulab Jamun', 40.00, true, 50),
  ('Pani Puri', 25.00, true, 65),
  ('Bisi Bele Bath', 120.00, true, 30),
  ('Shahi Paneer', 200.00, true, 22),
  ('Rava Upma', 70.00, true, 40),
  ('Malai Kofta', 180.00, true, 28),
  ('Coconut Chutney', 40.00, true, 50);

-- Sample data for payment table
INSERT INTO payment (payment_type, total_amount, payment_date, transaction_status, card_number, card_expiration_date, card_holder_name, upi_id)
VALUES
  ('Credit card', 1500.00, '2023-01-15 14:30:00', 'Success', '**** **** **** 1234', '2025-12-31', 'John Doe', NULL),
  ('Debit card', 750.00, '2023-01-16 12:45:00', 'Pending', '**** **** **** 5678', '2024-09-30', 'Jane Smith', NULL),
  ('UPI', 1200.00, '2023-01-17 16:20:00', 'Success', NULL, NULL, NULL, 'john.doe@upi'),
  ('Cash', 2000.00, '2023-01-18 10:10:00', 'Failed', NULL, NULL, NULL, NULL),
  ('Credit card', 3200.00, '2023-01-19 18:00:00', 'Success', '**** **** **** 9876', '2023-11-30', 'Alice Johnson', NULL),
  ('UPI', 500.00, '2023-01-20 14:55:00', 'Pending', NULL, NULL, NULL, 'alice.upi@upi'),
  ('Debit card', 800.00, '2023-01-21 09:45:00', 'Failed', '**** **** **** 4321', '2024-06-30', 'Bob Brown', NULL),
  ('Credit card', 1000.00, '2023-01-22 11:30:00', 'Success', '**** **** **** 7890', '2025-02-28', 'Eva Miller', NULL),
  ('UPI', 600.00, '2023-01-23 17:15:00', 'Success', NULL, NULL, NULL, 'eva.miller@upi'),
  ('Cash', 1800.00, '2023-01-24 13:20:00', 'Pending', NULL, NULL, NULL, NULL),
  ('Debit card', 950.00, '2023-01-25 15:40:00', 'Success', '**** **** **** 2468', '2024-08-31', 'Chris White', NULL),
  ('UPI', 850.00, '2023-01-26 20:05:00', 'Failed', NULL, NULL, NULL, 'chris.white@upi'),
  ('Credit card', 1300.00, '2023-01-27 08:25:00', 'Pending', '**** **** **** 1357', '2023-10-31', 'Sophia Garcia', NULL),
  ('Cash', 3000.00, '2023-01-28 11:15:00', 'Success', NULL, NULL, NULL, NULL),
  ('UPI', 700.00, '2023-01-29 16:30:00', 'Success', NULL, NULL, NULL, 'sophia.garcia@upi'),
  ('Debit card', 1200.00, '2023-01-30 09:50:00', 'Pending', '**** **** **** 3690', '2024-07-31', 'David Taylor', NULL),
  ('Credit card', 1100.00, '2023-01-31 14:00:00', 'Failed', '**** **** **** 8024', '2025-04-30', 'Olivia Wilson', NULL),
  ('UPI', 950.00, '2023-02-01 18:45:00', 'Success', NULL, NULL, NULL, 'olivia.wilson@upi'),
  ('Cash', 2500.00, '2023-02-02 12:30:00', 'Pending', NULL, NULL, NULL, NULL),
  ('Credit card', 1700.00, '2023-02-03 15:55:00', 'Success', '**** **** **** 2468', '2023-09-30', 'Daniel Martinez', NULL),
  ('Debit card', 800.00, '2023-02-04 10:10:00', 'Failed', '**** **** **** 7531', '2024-05-31', 'Mia Brown', NULL),
  ('UPI', 600.00, '2023-02-05 11:20:00', 'Success', NULL, NULL, NULL, 'daniel.martinez@upi'),
  ('Cash', 1200.00, '2023-02-06 17:05:00', 'Pending', NULL, NULL, NULL, NULL),
  ('Credit card', 1300.00, '2023-02-07 09:40:00', 'Pending', '**** **** **** 1598', '2025-07-31', 'Aiden Johnson', NULL),
  ('UPI', 850.00, '2023-02-08 14:15:00', 'Success', NULL, NULL, NULL, 'aiden.johnson@upi'),
  ('Debit card', 1000.00, '2023-02-09 18:30:00', 'Failed', '**** **** **** 4785', '2024-03-31', 'Emily Davis', NULL),
  ('Cash', 2800.00, '2023-02-10 11:55:00', 'Success', NULL, NULL, NULL, NULL),
  ('UPI', 700.00, '2023-02-11 16:10:00', 'Success', NULL, NULL, NULL, 'emily.davis@upi'),
  ('Credit card', 950.00, '2023-02-12 09:25:00', 'Pending', '**** **** **** 8023', '2025-05-31', 'Elijah Moore', NULL),
  ('Debit card', 1100.00, '2023-02-13 14:50:00', 'Success', '**** **** **** 3579', '2024-12-31', 'Amelia Wright', NULL),
  ('UPI', 1200.00, '2023-02-14 18:05:00', 'Failed', NULL, NULL, NULL, 'elijah.moore@upi');

-- Sample data for customer table
INSERT INTO customer (payment_id, customer_name, phone_num, email, order_date, table_num, order_status)
VALUES
  (1, 'Michael Smith', 9876543210, 'michael.smith@example.com', '2023-01-15 12:30:00', 5, 'Completed'),
  (2, 'Jennifer Johnson', 8765432109, 'jennifer.johnson@example.com', '2023-01-16 13:45:00', 8, 'Completed'),
  (3, 'Christopher Davis', 7654321098, 'christopher.davis@example.com', '2023-01-17 14:20:00', 12, 'Completed'),
  (4, 'Amanda Wilson', 6543210987, 'amanda.wilson@example.com', '2023-01-18 15:10:00', 3, 'Completed'),
  (5, 'Brian Miller', 5432109876, 'brian.miller@example.com', '2023-01-19 16:05:00', 7, 'Completed'),
  (6, 'Emily Taylor', 4321098765, 'emily.taylor@example.com', '2023-01-20 17:30:00', 10, 'Completed'),
  (7, 'Matthew Brown', 3210987654, 'matthew.brown@example.com', '2023-01-21 18:15:00', 2, 'Completed'),
  (8, 'Sophia Garcia', 2109876543, 'sophia.garcia@example.com', '2023-01-22 19:20:00', 6, 'Completed'),
  (9, 'Daniel Martinez', 1098765432, 'daniel.martinez@example.com', '2023-01-23 20:45:00', 9, 'Completed'),
  (10, 'Olivia White', 9876543210, 'olivia.white@example.com', '2023-01-24 21:10:00', 4, 'Completed'),
  (11, 'James Taylor', 8765432109, 'james.taylor@example.com', '2023-01-25 22:25:00', 8, 'Completed'),
  (12, 'Mia Davis', 7654321098, 'mia.davis@example.com', '2023-01-26 23:50:00', 11, 'Completed'),
  (13, 'Ethan Wilson', 6543210987, 'ethan.wilson@example.com', '2023-01-27 14:30:00', 5, 'Completed'),
  (14, 'Ava Miller', 5432109876, 'ava.miller@example.com', '2023-01-28 15:45:00', 7, 'Completed'),
  (15, 'Logan Brown', 4321098765, 'logan.brown@example.com', '2023-01-29 16:20:00', 10, 'Completed'),
  (16, 'Emma Garcia', 3210987654, 'emma.garcia@example.com', '2023-01-30 17:35:00', 3, 'Completed'),
  (17, 'Lucas Martinez', 2109876543, 'lucas.martinez@example.com', '2023-01-31 18:10:00', 6, 'Completed'),
  (18, 'Isabella White', 1098765432, 'isabella.white@example.com', '2023-02-01 19:25:00', 9, 'Completed'),
  (19, 'Alexander Taylor', 9876543210, 'alexander.taylor@example.com', '2023-02-02 20:50:00', 4, 'Completed'),
  (20, 'Madison Davis', 8765432109, 'madison.davis@example.com', '2023-02-03 21:15:00', 8, 'Completed'),
  (21, 'Jackson Wilson', 7654321098, 'jackson.wilson@example.com', '2023-02-04 22:30:00', 11, 'Completed'),
  (22, 'Avery Miller', 6543210987, 'avery.miller@example.com', '2023-02-05 23:55:00', 5, 'Completed'),
  (23, 'Brooklyn Brown', 5432109876, 'brooklyn.brown@example.com', '2023-02-06 14:10:00', 7, 'Completed'),
  (24, 'Carter Garcia', 4321098765, 'carter.garcia@example.com', '2023-02-07 15:25:00', 10, 'Completed'),
  (25, 'Chloe Martinez', 3210987654, 'chloe.martinez@example.com', '2023-02-08 16:50:00', 3, 'Completed'),
  (26, 'Elijah White', 2109876543, 'elijah.white@example.com', '2023-02-09 17:15:00', 6, 'Preparing'),
  (27, 'Grace Taylor', 1098765432, 'grace.taylor@example.com', '2023-02-10 18:30:00', 9, 'Preparing'),
  (28, 'Aiden Davis', 9876543210, 'aiden.davis@example.com', '2023-02-11 19:55:00', 4, 'Preparing'),
  (29, 'Zoe Wilson', 8765432109, 'zoe.wilson@example.com', '2023-02-12 20:20:00', 8, 'Preparing'),
  (30, 'Jackson Brown', 7654321098, 'jackson.brown@example.com', '2023-02-13 21:35:00', 11, 'Preparing'),
  (31, 'Elijah Moore', 9458284724, 'elijah.moore@example.com', '2023-11-15 08:30:00', 8, 'Preparing');

-- Sample data for kitchen table
INSERT INTO kitchen (order_id, dish_id, quantity)
VALUES
  (1, 1, 2),   -- Michael Smith ordered 2 servings of Biryani
  (2, 5, 1),   -- Jennifer Johnson ordered 1 serving of Masala Dosa
  (3, 10, 3),  -- Christopher Davis ordered 3 servings of Butter Chicken
  (4, 15, 2),  -- Amanda Wilson ordered 2 servings of Paneer Tikka
  (5, 20, 1),  -- Brian Miller ordered 1 serving of Rogan Josh
  (6, 25, 3),  -- Emily Taylor ordered 3 servings of Chicken Biryani
  (7, 30, 2),  -- Matthew Brown ordered 2 servings of Idli Sambhar
  (8, 2, 1),   -- Sophia Garcia ordered 1 serving of Chicken Korma
  (9, 7, 3),   -- Daniel Martinez ordered 3 servings of Aloo Paratha
  (10, 12, 2), -- Olivia White ordered 2 servings of Chole Bhature
  (11, 17, 1), -- James Taylor ordered 1 serving of Palak Paneer
  (12, 22, 3), -- Mia Davis ordered 3 servings of South Indian Thali
  (13, 27, 2), -- Ethan Wilson ordered 2 servings of Dal Makhani
  (14, 3, 1),  -- Ava Miller ordered 1 serving of Tandoori Chicken
  (15, 8, 3),  -- Logan Brown ordered 3 servings of Veg Biryani
  (16, 13, 2), -- Emma Garcia ordered 2 servings of Chicken 65
  (17, 18, 1), -- Lucas Martinez ordered 1 serving of Fish Curry
  (18, 23, 3), -- Isabella White ordered 3 servings of Sambar Rice
  (19, 28, 2), -- Alexander Taylor ordered 2 servings of Ghee Roast Dosa
  (20, 4, 1),  -- Madison Davis ordered 1 serving of Malai Kofta
  (21, 9, 3),  -- Jackson Wilson ordered 3 servings of Veg Hakka Noodles
  (22, 14, 2), -- Avery Miller ordered 2 servings of Chicken Biryani
  (23, 19, 1), -- Brooklyn Brown ordered 1 serving of Mysore Pak
  (24, 24, 3), -- Carter Garcia ordered 3 servings of Pongal
  (25, 29, 2), -- Chloe Martinez ordered 2 servings of Chicken Curry
  (26, 5, 1),  -- Elijah White ordered 1 serving of Masala Dosa
  (27, 10, 3), -- Grace Taylor ordered 3 servings of Butter Chicken
  (28, 15, 2), -- Aiden Davis ordered 2 servings of Paneer Tikka
  (29, 20, 1), -- Zoe Wilson ordered 1 serving of Rogan Josh
  (30, 25, 3), -- Jackson Brown ordered 3 servings of Chicken Biryani
  (31, 5, 2),
  (31, 21, 7),
  (31, 13, 3);

-- Sample data for restaurant table

INSERT INTO restaurant (
  restaurant_name,
  address,
  restaurant_phone_num,
  restaurant_email,
  description,
) VALUES (
  'Sakura Sushi House',
  '456 Cherry Blossom Lane, Tokyo',
  '+81 90-1234-5678',
  'info@sakurasushi.com',
  'Experience the finest sushi and Japanese cuisine in a traditional setting.',
  'https://example.com/sakurasushi_logo.png'
);

COMMIT;