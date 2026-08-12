const express = require('express');
const pool = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// POST /api/orders - checkout: create order from current cart
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { shipping_address } = req.body;

    await client.query('BEGIN');

    const cartResult = await client.query(
      `SELECT ci.quantity, p.id AS product_id, p.name, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1`,
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cartResult.rows) {
      if (item.quantity > item.stock) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
      }
    }

    const total = cartResult.rows.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, shipping_address) VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, total.toFixed(2), shipping_address || '']
    );
    const order = orderResult.rows[0];

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.name, item.price, item.quantity]
      );
      await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [
        item.quantity,
        item.product_id,
      ]);
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  } finally {
    client.release();
  }
});

// GET /api/orders - list current user's orders with items
router.get('/', async (req, res) => {
  try {
    const orders = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
        return { ...order, items: items.rows };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
