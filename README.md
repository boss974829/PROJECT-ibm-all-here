FOR LIVE"https://project-ibm-all-here-1.onrender.com"
<<<<<<< HEAD
# Shoply — Full-Stack E-Commerce (Dockerized)

A complete e-commerce web app: **React (Vite) frontend**, **Node/Express REST API**, and **PostgreSQL** database, all orchestrated with **Docker Compose**.

## Features

- Product catalog with category filter + search
- User registration/login (JWT auth, bcrypt password hashing)
- Persistent cart per user (stored in Postgres)
- Checkout flow that creates an order, deducts stock, and clears the cart
- Order history page
- Admin-only endpoints to create/update/delete products (set `is_admin = true` on a user row to use them)

## Stack

| Layer     | Tech                                  |
|-----------|----------------------------------------|
| Frontend  | React 18, Vite, React Router, plain CSS |
| Backend   | Node.js, Express, JWT, bcryptjs        |
| Database  | PostgreSQL 16                          |
| Infra     | Docker, Docker Compose, Nginx (serves the built frontend) |

## Project structure

```
ecommerce-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── db.js
│   ├── init.sql          # schema + seed data, auto-run on first Postgres start
│   ├── middleware/auth.js
│   └── routes/            # auth.js, products.js, cart.js, orders.js
└── frontend/
    ├── Dockerfile          # multi-stage: build with Vite, serve with Nginx
    ├── nginx.conf
    └── src/
        ├── pages/          # Home, ProductDetail, Cart, Checkout, Orders, Login, Register
        ├── components/     # Navbar, ProductCard
        ├── context/        # AuthContext, CartContext
        └── api.js          # fetch wrapper for the backend API
```

## Running it

You need Docker and Docker Compose installed. Then, from the `ecommerce-app` folder:

```bash
docker compose up --build
```

This will:
1. Start Postgres and load `init.sql` (creates tables + seeds ~12 sample products)
2. Build and start the Express API on **http://localhost:5000**
3. Build the React app and serve it via Nginx on **http://localhost:3000**

Open **http://localhost:3000** in your browser.

To stop everything:
```bash
docker compose down
```

To wipe the database and start fresh:
```bash
docker compose down -v
```

## Using the app

1. Go to **Sign up** and create an account.
2. Browse products on the homepage, filter by category, or search.
3. Add items to your cart, adjust quantities, then **Checkout**.
4. Enter a shipping address and place the order.
5. View past orders under **Orders**.

## Making a user an admin

Admin-only endpoints (`POST/PUT/DELETE /api/products`) require `is_admin = true`. After registering a user, run:

```bash
docker exec -it ecommerce-postgres psql -U ecommerce_user -d ecommerce -c \
  "UPDATE users SET is_admin = true WHERE email = 'you@example.com';"
```

Then log out and back in so a fresh token (containing `is_admin: true`) is issued.

## API overview

| Method | Endpoint              | Auth        | Description                     |
|--------|------------------------|-------------|----------------------------------|
| POST   | /api/auth/register     | —           | Create account                  |
| POST   | /api/auth/login        | —           | Log in, get JWT                 |
| GET    | /api/products          | —           | List products (`?category=&search=`) |
| GET    | /api/products/:id      | —           | Product detail                  |
| POST   | /api/products          | Admin       | Create product                  |
| PUT    | /api/products/:id      | Admin       | Update product                  |
| DELETE | /api/products/:id      | Admin       | Delete product                  |
| GET    | /api/cart              | User        | Get current cart                |
| POST   | /api/cart               | User        | Add item to cart                |
| PUT    | /api/cart/:id          | User        | Update item quantity            |
| DELETE | /api/cart/:id          | User        | Remove item from cart           |
| POST   | /api/orders             | User        | Checkout (create order)         |
| GET    | /api/orders             | User        | List past orders                |

## Local development (without Docker)

Backend:
```bash
cd backend
npm install
# set DATABASE_URL and JWT_SECRET env vars, or use a .env file
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Notes for production use

- Change `JWT_SECRET` and Postgres credentials in `docker-compose.yml` before deploying anywhere public.
- Add HTTPS (e.g. a reverse proxy like Traefik or Caddy in front of Nginx).
- Consider adding rate limiting, input validation (e.g. Zod/Joi), and a real payment provider integration (Stripe, etc.) — this project uses a mock checkout with no real payment processing.
=======
# PROJECT-ibm-all-here
my all projects aree here
>>>>>>> debf0367ad123926f0edefa2de3f9576feaf73b7
