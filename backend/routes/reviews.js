const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Post review (Must be purchased)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { book_id, review_text, rating, name } = req.body;

        // Check if user has purchased the book
        const [orders] = await pool.query(
            "SELECT oi.id FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.user_id = ? AND oi.book_id = ?", [req.user.id, book_id]);

        if (orders.length === 0) {
            return res.status(403).json({ error: 'You must purchase this book to leave a review.' });
        }

        await pool.query(
            'INSERT INTO reviews (book_id, review_text, rating, name) VALUES (?, ?, ?, ?)',
            [book_id, review_text, rating, name || 'Anonymous']
        );

        res.status(201).json({ message: 'Review posted anonymously!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get reviews for a book
router.get('/:bookId', async (req, res) => {
    try {
        const [reviews] = await pool.query('SELECT * FROM reviews WHERE book_id = ? ORDER BY created_at DESC', [req.params.bookId]);
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
