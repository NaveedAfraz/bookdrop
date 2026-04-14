const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch bundles
router.get('/', async (req, res) => {
    try {
        const [bundles] = await pool.query('SELECT * FROM bundles');
        
        for (let bundle of bundles) {
            const [books] = await pool.query(`
                SELECT b.* FROM books b 
                JOIN bundle_books bb ON b.id = bb.book_id 
                WHERE bb.bundle_id = ?
            `, [bundle.id]);
            
            bundle.books = books;
            let originalPrice = books.reduce((acc, b) => acc + parseFloat(b.price), 0);
            bundle.original_price = originalPrice;
            bundle.discounted_price = originalPrice * (1 - (bundle.discount_percent / 100));
        }

        // Mock data if none exists
        if (bundles.length === 0) {
             return res.json([
                  { id: 1, title: 'Sci-Fi Starter Pack', description: 'The best of the galaxy.', discount_percent: 20, original_price: 45.00, discounted_price: 36.00, books: [] }
             ]);
        }

        res.json(bundles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Custom Bundle logic for cart 
router.post('/custom-discount', authMiddleware, async (req, res) => {
    try {
        const { cart_size } = req.body;
        let discount = 0;
        if (cart_size >= 10) discount = 15;
        else if (cart_size >= 5) discount = 10;
        else if (cart_size >= 3) discount = 5;

        res.json({ discount_percent: discount, message: discount > 0 ? `Custom bundle unlocked: ${discount}% off` : 'Add more to unlock custom bundle discount!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
