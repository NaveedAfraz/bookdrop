const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// User requests a refund
router.post('/request', authMiddleware, async (req, res) => {
    try {
        const { book_id, order_id, reason } = req.body;

        // Verify purchase exists
        const [items] = await pool.query(
            'SELECT id FROM order_items WHERE order_id = ? AND book_id = ?',
            [order_id, book_id]
        );

        if (items.length === 0) {
            return res.status(400).json({ error: 'Purchase not found for this book in the specified order.' });
        }

        // Avoid duplicates
        const [existing] = await pool.query(
            'SELECT id FROM refund_requests WHERE user_id = ? AND book_id = ? AND order_id = ?',
            [req.user.id, book_id, order_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Refund request already submitted for this book.' });
        }

        await pool.query(
            'INSERT INTO refund_requests (user_id, book_id, order_id, reason) VALUES (?, ?, ?, ?)',
            [req.user.id, book_id, order_id, reason]
        );

        res.status(201).json({ message: 'Refund request submitted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// User gets their own refund requests
router.get('/my-requests', authMiddleware, async (req, res) => {
    try {
        const [requests] = await pool.query(`
            SELECT rr.*, b.title as book_title
            FROM refund_requests rr
            JOIN books b ON rr.book_id = b.id
            WHERE rr.user_id = ?
        `, [req.user.id]);
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
