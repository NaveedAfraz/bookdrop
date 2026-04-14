const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all wishlist items for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [wishlist] = await pool.query(`
            SELECT w.id as wishlist_id, w.book_id, b.title, b.author, b.price, b.cover_image, b.category
            FROM wishlist w 
            JOIN books b ON w.book_id = b.id 
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        `, [req.user.id]);
        
        res.json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from wishlist
router.delete('/:bookId', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM wishlist WHERE user_id = ? AND book_id = ?', [req.user.id, req.params.bookId]);
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add wishlist item directly to cart
router.post('/cart', authMiddleware, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { book_id } = req.body;

        // Verify it's in wishlist
        const [wishlistItem] = await connection.query('SELECT id FROM wishlist WHERE user_id = ? AND book_id = ?', [req.user.id, book_id]);
        if (wishlistItem.length === 0) {
            throw new Error('Item not in wishlist');
        }

        // Get book details
        const [books] = await connection.query('SELECT price FROM books WHERE id = ?', [book_id]);
        if (books.length === 0) throw new Error('Book not found');
        const price = books[0].price;

        // Get or Create Cart
        let [cart] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
        let cartId;
        if (cart.length === 0) {
            const [newCart] = await connection.query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
            cartId = newCart.insertId;
        } else {
            cartId = cart[0].id;
        }

        // Add to cart
        const [existing] = await connection.query('SELECT id FROM cart_items WHERE cart_id = ? AND book_id = ?', [cartId, book_id]);
        if (existing.length > 0) {
            await connection.query('UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?', [existing[0].id]);
        } else {
            await connection.query('INSERT INTO cart_items (cart_id, book_id, quantity, price) VALUES (?, ?, 1, ?)', [cartId, book_id, price]);
        }

        // Remove from wishlist
        await connection.query('DELETE FROM wishlist WHERE user_id = ? AND book_id = ?', [req.user.id, book_id]);

        await connection.commit();
        res.json({ message: 'Moved to cart' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
