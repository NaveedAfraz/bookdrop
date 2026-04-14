const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [addresses] = await pool.query('SELECT * FROM addresses WHERE user_id = ?', [req.user.id]);
        res.json(addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { full_name, phone, street, city, state, pincode, is_default } = req.body;
        
        if (is_default) {
            await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id]);
        }

        const [result] = await pool.query(
            'INSERT INTO addresses (user_id, full_name, phone, street, city, state, pincode, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, full_name, phone, street, city, state, pincode, is_default || false]
        );

        res.status(201).json({ message: 'Address created', addressId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { full_name, phone, street, city, state, pincode, is_default } = req.body;
        
        if (is_default) {
            await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id]);
        }

        await pool.query(
            'UPDATE addresses SET full_name = ?, phone = ?, street = ?, city = ?, state = ?, pincode = ?, is_default = ? WHERE id = ? AND user_id = ?',
            [full_name, phone, street, city, state, pincode, is_default || false, req.params.id, req.user.id]
        );

        res.json({ message: 'Address updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Address deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
