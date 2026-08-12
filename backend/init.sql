-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cart items (one row per user/product)
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'placed',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL
);

-- Seed sample products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Wireless Headphones', 'Over-ear Bluetooth headphones with noise cancellation.', 79.99, 'https://picsum.photos/seed/headphones/400/400', 'Electronics', 50),
('Smart Watch', 'Fitness tracking smart watch with heart-rate monitor.', 129.99, 'https://picsum.photos/seed/watch/400/400', 'Electronics', 30),
('Running Shoes', 'Lightweight breathable running shoes.', 59.99, 'https://picsum.photos/seed/shoes/400/400', 'Fashion', 100),
('Backpack', 'Water-resistant travel backpack, 30L.', 44.99, 'https://picsum.photos/seed/backpack/400/400', 'Fashion', 75),
('Coffee Maker', '12-cup programmable coffee maker.', 39.99, 'https://picsum.photos/seed/coffee/400/400', 'Home', 40),
('Desk Lamp', 'LED desk lamp with adjustable brightness.', 24.99, 'https://picsum.photos/seed/lamp/400/400', 'Home', 60),
('Yoga Mat', 'Non-slip eco-friendly yoga mat.', 19.99, 'https://picsum.photos/seed/yoga/400/400', 'Sports', 90),
('Bluetooth Speaker', 'Portable waterproof Bluetooth speaker.', 34.99, 'https://picsum.photos/seed/speaker/400/400', 'Electronics', 65),
('Sunglasses', 'Polarized UV-protection sunglasses.', 15.99, 'https://picsum.photos/seed/sunglasses/400/400', 'Fashion', 120),
('Ceramic Mug Set', 'Set of 4 handcrafted ceramic mugs.', 22.99, 'https://picsum.photos/seed/mug/400/400', 'Home', 55),
('Laptop Stand', 'Adjustable aluminum laptop stand.', 29.99, 'https://picsum.photos/seed/laptopstand/400/400', 'Electronics', 45),
('Water Bottle', 'Insulated stainless steel water bottle, 1L.', 18.99, 'https://picsum.photos/seed/bottle/400/400', 'Sports', 150)
ON CONFLICT DO NOTHING;
