const express = require('express');
const pool = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - list all (supports ?category= & ?search=)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }
    query += ' ORDER BY id ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - admin only
router.post('/', authRequired, adminRequired, async (req, res) => {
  try {
    const { name, description, price, image_url, category, stock } = req.body;
    if (!name || price == null) return res.status(400).json({ error: 'name and price are required' });

    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, category, stock)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description || '', price, image_url || '', category || '', stock || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - admin only
router.put('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const { name, description, price, image_url, category, stock } = req.body;
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, image_url=$4, category=$5, stock=$6
       WHERE id=$7 RETURNING *`,
      [name, description, price, image_url, category, stock, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - admin only
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
