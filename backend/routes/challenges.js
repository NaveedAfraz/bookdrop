const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get active challenges and user progress
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [challenges] = await pool.query(`
            SELECT c.*, uc.books_read, uc.completed_at, 
                   IF(uc.id IS NOT NULL, true, false) as is_joined
            FROM challenges c
            LEFT JOIN user_challenges uc ON c.id = uc.challenge_id AND uc.user_id = ?
        `, [req.user.id]);
        
        // Mock active challenges if empty for demo purposes
        if (challenges.length === 0) {
            return res.json([
                 { id: 1, title: 'Read 5 Sci-Fi Books', description: 'Explore the galaxy.', book_count: 5, reward_points: 500, is_joined: false, books_read: 0 },
                 { id: 2, title: 'Mystery Month', description: 'Solve 3 thrillers.', book_count: 3, reward_points: 300, is_joined: true, books_read: 2 }
            ]);
        }
        res.json(challenges);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Join a challenge
router.post('/join', authMiddleware, async (req, res) => {
    try {
        const { challenge_id } = req.body;
        await pool.query(
            'INSERT IGNORE INTO user_challenges (user_id, challenge_id) VALUES (?, ?)',
            [req.user.id, challenge_id]
        );
        res.json({ message: 'Joined challenge successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Complete a challenge
router.post('/complete', authMiddleware, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { challenge_id } = req.body;

        const [c] = await connection.query('SELECT reward_points FROM challenges WHERE id = ?', [challenge_id]);
        if(c.length === 0) throw new Error('Challenge not found');

        await connection.query(
            'UPDATE user_challenges SET completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND challenge_id = ?',
            [req.user.id, challenge_id]
        );

        await connection.query('UPDATE users SET points = points + ? WHERE id = ?', [c[0].reward_points, req.user.id]);

        await connection.commit();
        res.json({ message: 'Challenge completed! Points awarded.' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
