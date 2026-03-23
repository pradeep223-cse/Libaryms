const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireRole } = require('../auth');

// Public or basic User route: Search for books
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    let sql = 'SELECT * FROM books';
    let params = [];
    
    if (query) {
      sql += ' WHERE title LIKE ? OR author LIKE ? OR category LIKE ?';
      const searchParam = `%${query}%`;
      params = [searchParam, searchParam, searchParam];
    }
    
    const [books] = await pool.query(sql, params);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

// Admin area: List all books
router.get('/', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const [books] = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Admin area: Add a new book
router.post('/', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { title, author, isbn, category } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO books (title, author, isbn, category) VALUES (?, ?, ?, ?)',
      [title, author, isbn || null, category || null]
    );
    
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Admin area: Delete a book
router.delete('/:id', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM books WHERE id = ?', [id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;
