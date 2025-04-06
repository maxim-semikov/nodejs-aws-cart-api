-- Insert test data into users
INSERT INTO users (id, email, password) VALUES
    ('b68a8d55-7cfb-40b9-81aa-a14a11e9a801', 'maxim-semikov@aws.test', 'TEST_PASSWORD');

-- Insert test data into carts
INSERT INTO carts (id, user_id, status) VALUES
    ('a68a8d55-7cfb-40b9-81aa-a14a11e9a800', 'b68a8d55-7cfb-40b9-81aa-a14a11e9a801', 'OPEN');

-- Insert test data into cart_items
INSERT INTO cart_items (cart_id, product_id, count) VALUES
    ('a68a8d55-7cfb-40b9-81aa-a14a11e9a800', 'cec86788-5ff0-4eda-bc90-33fb7eb9962e', 2),
    ('a68a8d55-7cfb-40b9-81aa-a14a11e9a800', 'de77cb7d-2480-47c3-b1dd-65d110162ff1', 1),
    ('a68a8d55-7cfb-40b9-81aa-a14a11e9a800', '36f48f61-8f76-4067-80ce-d22fb32132ff', 3);

-- Insert test data into orders
INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total) VALUES
    ('f68a8d55-7cfb-40b9-81aa-a14a11e9a805', 'b68a8d55-7cfb-40b9-81aa-a14a11e9a801', 'a68a8d55-7cfb-40b9-81aa-a14a11e9a800',
    '{"method": "card", "amount": 299.99}',
    '{"address": "123 Main St, New York, 10001", "firstName": "John", "lastName": "Doe", "comment": "Please deliver after 6 PM"}',
    'Please deliver after 6 PM',
    'PAID',
    9); 