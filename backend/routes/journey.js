const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get Journey Timeline for a specific second hand book copy
router.get('/:shBookId', async (req, res) => {
    try {
        const [journey] = await pool.query(`
            SELECT bj.*, u.name as owner_name 
            FROM book_journey bj
            JOIN users u ON bj.owner_id = u.id
            WHERE bj.sh_book_id = ?
            ORDER BY bj.owned_from ASC
        `, [req.params.shBookId]);
        
        res.json(journey);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Most Travelled books (Leaderboard)
router.get('/leaderboard/most-travelled', async (req, res) => {
    try {
        const [leaderboard] = await pool.query(`
            SELECT sh.id as sh_book_id, b.title, b.author, b.cover_image, COUNT(bj.id) as journeys
            FROM second_hand_books sh
            JOIN books b ON sh.book_id = b.id
            JOIN book_journey bj ON sh.id = bj.sh_book_id
            GROUP BY sh.id
            ORDER BY journeys DESC
            LIMIT 10
        `);
        res.json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a note to an existing journey
router.post('/note', authMiddleware, async (req, res) => {
    try {
        const { sh_book_id, note } = req.body;
        // Verify user owns it
        const [journey] = await pool.query(`
            SELECT id FROM book_journey 
            WHERE sh_book_id = ? AND owner_id = ? 
            ORDER BY owned_from DESC LIMIT 1
        `, [sh_book_id, req.user.id]);

        if (journey.length === 0) return res.status(403).json({ error: 'You do not own this book copy recently' });

        await pool.query('UPDATE book_journey SET note = ? WHERE id = ?', [note, journey[0].id]);
        res.json({ message: 'Note saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
