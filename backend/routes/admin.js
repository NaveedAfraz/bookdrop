const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const auth = [authMiddleware, adminMiddleware];

// ─── STATS ───────────────────────────────────────────────────────────────────
router.get('/stats', ...auth, async (req, res) => {
    try {
        const [[{ revenue }]] = await pool.query('SELECT SUM(total_amount) as revenue FROM orders');
        const [[{ userCount }]] = await pool.query('SELECT COUNT(*) as userCount FROM users');
        const [[{ orderCount }]] = await pool.query('SELECT COUNT(*) as orderCount FROM orders');
        const [[{ bookCount }]] = await pool.query('SELECT COUNT(*) as bookCount FROM books');
        const [[{ challengeCount }]] = await pool.query('SELECT COUNT(*) as challengeCount FROM challenges');
        const [recentSales] = await pool.query(`SELECT DATE(created_at) as date, SUM(total_amount) as amount FROM orders GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7`);
        const [categorySales] = await pool.query(`SELECT b.category, COUNT(oi.id) as count FROM order_items oi JOIN books b ON oi.book_id = b.id GROUP BY b.category`);
        res.json({ revenue: revenue || 0, userCount, orderCount, bookCount, challengeCount, recentSales, categorySales });
    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

// ─── REFUNDS ─────────────────────────────────────────────────────────────────
router.get('/refunds', ...auth, async (req, res) => {
    try {
        const [refunds] = await pool.query(`SELECT rr.*, u.name as user_name, b.title as book_title FROM refund_requests rr JOIN users u ON rr.user_id = u.id JOIN books b ON rr.book_id = b.id ORDER BY requested_at DESC`);
        res.json(refunds);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/refunds/:id', ...auth, async (req, res) => {
    try {
        await pool.query('UPDATE refund_requests SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
        res.json({ message: 'Updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── USERS ───────────────────────────────────────────────────────────────────
router.get('/users', ...auth, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/users/:id', ...auth, async (req, res) => {
    try {
        const { name, email, role } = req.body;
        await pool.query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, role, req.params.id]);
        res.json({ message: 'User updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/users/:id', ...auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────
router.get('/orders', ...auth, async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT o.*, u.name as user_name, u.email as user_email
            FROM orders o JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/orders/:id', ...auth, async (req, res) => {
    try {
        const { order_status, payment_status } = req.body;
        await pool.query('UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?', [order_status, payment_status, req.params.id]);
        res.json({ message: 'Order updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/orders/:id', ...auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        res.json({ message: 'Order deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── CHALLENGES ──────────────────────────────────────────────────────────────
router.get('/challenges', ...auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM challenges ORDER BY id DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/challenges', ...auth, async (req, res) => {
    try {
        const { title, description, book_count, duration_days, reward_points } = req.body;
        const [r] = await pool.query('INSERT INTO challenges (title, description, book_count, duration_days, reward_points) VALUES (?,?,?,?,?)', [title, description, book_count, duration_days, reward_points]);
        res.status(201).json({ id: r.insertId, message: 'Challenge created' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/challenges/:id', ...auth, async (req, res) => {
    try {
        const { title, description, book_count, duration_days, reward_points } = req.body;
        await pool.query('UPDATE challenges SET title=?, description=?, book_count=?, duration_days=?, reward_points=? WHERE id=?', [title, description, book_count, duration_days, reward_points, req.params.id]);
        res.json({ message: 'Challenge updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/challenges/:id', ...auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM challenges WHERE id = ?', [req.params.id]);
        res.json({ message: 'Challenge deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── BUNDLES ─────────────────────────────────────────────────────────────────
router.get('/bundles', ...auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bundles ORDER BY id DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/bundles', ...auth, async (req, res) => {
    try {
        const { title, description, discount_percent } = req.body;
        const [r] = await pool.query('INSERT INTO bundles (title, description, discount_percent) VALUES (?,?,?)', [title, description, discount_percent]);
        res.status(201).json({ id: r.insertId, message: 'Bundle created' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/bundles/:id', ...auth, async (req, res) => {
    try {
        const { title, description, discount_percent } = req.body;
        await pool.query('UPDATE bundles SET title=?, description=?, discount_percent=? WHERE id=?', [title, description, discount_percent, req.params.id]);
        res.json({ message: 'Bundle updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/bundles/:id', ...auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM bundles WHERE id = ?', [req.params.id]);
        res.json({ message: 'Bundle deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── MARKETPLACE (Second-Hand Books) ─────────────────────────────────────────
router.get('/marketplace', ...auth, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT sh.*, b.title as book_title, b.author, u.name as seller_name
            FROM second_hand_books sh
            JOIN books b ON sh.book_id = b.id
            JOIN users u ON sh.seller_id = u.id
            ORDER BY sh.created_at DESC
        `);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/marketplace/:id', ...auth, async (req, res) => {
    try {
        const { price, condition_desc, status } = req.body;
        await pool.query('UPDATE second_hand_books SET price=?, condition_desc=?, status=? WHERE id=?', [price, condition_desc, status, req.params.id]);
        res.json({ message: 'Listing updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/marketplace/:id', ...auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM second_hand_books WHERE id = ?', [req.params.id]);
        res.json({ message: 'Listing deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── ROOMS ───────────────────────────────────────────────────────────────────
router.get('/rooms', ...auth, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.*, b.title as book_title, u.name as creator_name,
            (SELECT COUNT(*) FROM room_members rm WHERE rm.room_id = r.id) as member_count
            FROM read_together_rooms r
            JOIN books b ON r.book_id = b.id
            JOIN users u ON r.created_by = u.id
            ORDER BY r.id DESC
        `);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/rooms/:id', ...auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM read_together_rooms WHERE id = ?', [req.params.id]);
        res.json({ message: 'Room deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
