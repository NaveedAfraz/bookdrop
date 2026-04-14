const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get course for a book (Must be purchased)
router.get('/:bookId', authMiddleware, async (req, res) => {
    try {
        const { bookId } = req.params;

        // Verify purchase
        const [orders] = await pool.query(`
            SELECT oi.id 
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.user_id = ? AND oi.book_id = ?
        `, [req.user.id, bookId]);

        if (orders.length === 0) {
            return res.status(403).json({ error: 'You must purchase this book to access the course bundle.' });
        }

        const [courses] = await pool.query('SELECT * FROM courses WHERE book_id = ?', [bookId]);
        
        if (courses.length === 0) {
            return res.status(404).json({ error: 'No course found for this book bundle.' });
        }

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
