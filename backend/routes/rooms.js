const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Join / Verify Read Together access
router.post('/join', authMiddleware, async (req, res) => {
    try {
        const { book_id, invite_code } = req.body;

        // Check if user has bought this book
        const [orders] = await pool.query(`
            SELECT oi.id 
            FROM order_items oi 
            JOIN orders o ON oi.order_id = o.id 
            WHERE o.user_id = ? AND oi.book_id = ?
        `, [req.user.id, book_id]);

        if (orders.length === 0) {
            return res.status(403).json({ error: 'BUY_NOW_PROMPT', message: 'You must own this book to join the read together room.' });
        }

        let room;
        // Find or create room logic via invite code
        if (invite_code) {
             const [rooms] = await pool.query('SELECT id FROM read_together_rooms WHERE invite_code = ? AND book_id = ?', [invite_code, book_id]);
             if (rooms.length === 0) return res.status(404).json({ error: 'Invalid invite code for this book' });
             room = rooms[0].id;
        } else {
             // Mock create if not using code
             const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
             const [result] = await pool.query('INSERT INTO read_together_rooms (book_id, created_by, invite_code) VALUES (?, ?, ?)', [book_id, req.user.id, randomCode]);
             room = result.insertId;
        }

        await pool.query('INSERT IGNORE INTO room_members (room_id, user_id) VALUES (?, ?)', [room, req.user.id]);

        res.json({ message: 'Welcome to the room!', room_id: room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch messages
router.get('/:roomId/messages', authMiddleware, async (req, res) => {
    try {
        const [messages] = await pool.query(`
            SELECT rm.*, u.name as user_name 
            FROM room_messages rm
            JOIN users u ON rm.user_id = u.id
            WHERE room_id = ?
            ORDER BY sent_at ASC
        `, [req.params.roomId]);
        
        // Mock message
        if (messages.length === 0) {
            return res.json([]);
        }

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
