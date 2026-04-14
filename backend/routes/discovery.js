const express = require('express');
const router = express.Router();
const pool = require('../db');

// Filter books by country (for Map)
router.get('/map/:country', async (req, res) => {
    try {
        const [books] = await pool.query('SELECT * FROM books WHERE country = ?', [req.params.country]);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Filter books by year range (for Time Machine)
router.get('/timeline/:start/:end', async (req, res) => {
    try {
        const { start, end } = req.params;
        const [books] = await pool.query('SELECT * FROM books WHERE published_year >= ? AND published_year <= ?', [start, end]);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all unique countries that have books
router.get('/countries', async (req, res) => {
    try {
        const [countries] = await pool.query('SELECT DISTINCT country FROM books WHERE country IS NOT NULL');
        res.json(countries.map(c => c.country));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
