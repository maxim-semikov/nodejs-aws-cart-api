-- Insert test data into carts
INSERT INTO carts (id, user_id, status) VALUES
    ('a68a8d55-7cfb-40b9-81aa-a14a11e9a800', 'b68a8d55-7cfb-40b9-81aa-a14a11e9a801', 'OPEN'),
    ('c68a8d55-7cfb-40b9-81aa-a14a11e9a802', 'b68a8d55-7cfb-40b9-81aa-a14a11e9a801', 'ORDERED'),
    ('d68a8d55-7cfb-40b9-81aa-a14a11e9a803', 'e68a8d55-7cfb-40b9-81aa-a14a11e9a804', 'OPEN');

-- Insert test data into cart_items
INSERT INTO cart_items (cart_id, product_id, count) VALUES
    ('a68a8d55-7cfb-40b9-81aa-a14a11e9a800', '7af1b3c7-8d1e-4c2f-9b4a-6e5d8e7f9a0b', 2),
    ('a68a8d55-7cfb-40b9-81aa-a14a11e9a800', '9cd2e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 1),
    ('c68a8d55-7cfb-40b9-81aa-a14a11e9a802', 'b5e7d31c-5a2b-4f98-b432-1a5e9f678d90', 3),
    ('d68a8d55-7cfb-40b9-81aa-a14a11e9a803', 'c4f8e2a1-9b6d-4c7e-8f3a-2d5b9c6a4e8d', 1); 