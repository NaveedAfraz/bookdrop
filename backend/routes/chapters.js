const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:bookId', async (req, res) => {
    try {
        const [chapters] = await pool.query(
            'SELECT id, book_id, chapter_number, is_free, IF(is_free = 1, content, NULL) as content FROM chapters WHERE book_id = ? ORDER BY chapter_number ASC',
            [req.params.bookId]
        );
        res.json(chapters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
