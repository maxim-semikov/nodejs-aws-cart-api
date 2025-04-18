-- Clear all data from tables
TRUNCATE users CASCADE;
TRUNCATE orders CASCADE;
TRUNCATE cart_items CASCADE;
TRUNCATE carts CASCADE;

-- Drop tables if needed
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS cart_status CASCADE;

-- Drop indexes
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_orders_cart_id;
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_carts_user_id;
