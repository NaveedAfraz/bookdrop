const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all second hand books
router.get('/', async (req, res) => {
    try {
        const [books] = await pool.query(`
            SELECT sh.*, b.title, b.author, b.cover_image, b.category, u.name as seller_name,
            (SELECT city FROM addresses a WHERE a.user_id = sh.seller_id LIMIT 1) as seller_city
            FROM second_hand_books sh
            JOIN books b ON sh.book_id = b.id
            JOIN users u ON sh.seller_id = u.id
            WHERE sh.status = 'AVAILABLE'
            ORDER BY sh.created_at DESC
        `);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sell a book
router.post('/sell', authMiddleware, async (req, res) => {
    try {
        const { book_id, price, condition_desc } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO second_hand_books (book_id, seller_id, price, condition_desc) VALUES (?, ?, ?, ?)',
            [book_id, req.user.id, price, condition_desc]
        );

        res.status(201).json({ message: 'Book listed for sale!', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
