const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Get all books with search, filter, sort
router.get('/', async (req, res) => {
    try {
        const { search, category, sortBy } = req.query;
        let query = 'SELECT * FROM books WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (title LIKE ? OR author LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (sortBy === 'price_asc') {
            query += ' ORDER BY price ASC';
        } else if (sortBy === 'price_desc') {
            query += ' ORDER BY price DESC';
        } else {
            query += ' ORDER BY created_at DESC';
        }

        const [books] = await pool.query(query, params);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get book by id
router.get('/:id', async (req, res) => {
    try {
        const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
        if (books.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(books[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new book (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, author, description, price, stock, cover_image, category, country, published_year } = req.body;
        const [result] = await pool.query(
            'INSERT INTO books (title, author, description, price, stock, cover_image, category, country, published_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, author, description, price, stock, cover_image || null, category, country || null, published_year || null]
        );
        const [newBook] = await pool.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
        res.status(201).json(newBook[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a book (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, author, description, price, stock, cover_image, category, country, published_year } = req.body;
        await pool.query(
            'UPDATE books SET title=?, author=?, description=?, price=?, stock=?, cover_image=?, category=?, country=?, published_year=? WHERE id=?',
            [title, author, description, price, stock, cover_image || null, category, country || null, published_year || null, req.params.id]
        );
        const [updated] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a book (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

