const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { book_id, action } = req.body;
        
        // Ensure action is valid
        if (!['RIGHT', 'LEFT', 'UP', 'DOWN'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action' });
        }

        // Save into user_swipes
        await pool.query(
            'INSERT IGNORE INTO user_swipes (user_id, book_id, action) VALUES (?, ?, ?)',
            [req.user.id, book_id, action]
        );

        // If swipe RIGHT, also add to wishlist
        if (action === 'RIGHT') {
            await pool.query(
                'INSERT IGNORE INTO wishlist (user_id, book_id) VALUES (?, ?)',
                [req.user.id, book_id]
            );
        }

        res.json({ message: `Swiped ${action}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch books for swiping (books user hasn't swiped yet)
router.get('/feed', authMiddleware, async (req, res) => {
    try {
        const [books] = await pool.query(`
            SELECT b.* 
            FROM books b
            LEFT JOIN user_swipes us ON b.id = us.book_id AND us.user_id = ?
            WHERE us.id IS NULL
            ORDER BY RAND()
            LIMIT 10
        `, [req.user.id]);
        
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
