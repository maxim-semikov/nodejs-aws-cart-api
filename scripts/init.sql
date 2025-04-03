-- Create enum type for cart status
CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status cart_status NOT NULL DEFAULT 'OPEN'
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    count INTEGER NOT NULL CHECK (count > 0),
    PRIMARY KEY (cart_id, product_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id); 