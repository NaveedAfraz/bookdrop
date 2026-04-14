const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const getCartId = async (userId) => {
    let [cart] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (cart.length === 0) {
        const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
        return result.insertId;
    }
    return cart[0].id;
};

// Get cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        const cartId = await getCartId(req.user.id);
        const [items] = await pool.query(`
            SELECT ci.id as cart_item_id, ci.quantity, ci.price as added_price, ci.is_second_hand, ci.sh_book_id, b.*
            FROM cart_items ci
            JOIN books b ON ci.book_id = b.id
            WHERE ci.cart_id = ?
        `, [cartId]);

        let total = items.reduce((acc, item) => acc + (parseFloat(item.added_price) * item.quantity), 0);

        res.json({ cartId, items, total: total.toFixed(2) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { book_id, quantity, is_second_hand, sh_book_id } = req.body;
        const cartId = await getCartId(req.user.id);

        let price = 0;
        
        if (is_second_hand) {
             const [shb] = await pool.query('SELECT price, status FROM second_hand_books WHERE id = ?', [sh_book_id]);
             if (shb.length === 0 || shb[0].status !== 'AVAILABLE') return res.status(404).json({ error: 'Second hand book not available' });
             price = shb[0].price;
        } else {
             const [books] = await pool.query('SELECT price FROM books WHERE id = ?', [book_id]);
             if (books.length === 0) return res.status(404).json({ error: 'Book not found' });
             price = books[0].price;
        }

        const [existing] = await pool.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND book_id = ? AND is_second_hand = ? AND IFNULL(sh_book_id, 0) = ?', 
            [cartId, book_id, is_second_hand || false, sh_book_id || 0]
        );

        if (existing.length > 0 && !is_second_hand) {
            await pool.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity || 1, existing[0].id]);
        } else if (existing.length === 0) {
            await pool.query(
                'INSERT INTO cart_items (cart_id, book_id, quantity, price, is_second_hand, sh_book_id) VALUES (?, ?, ?, ?, ?, ?)', 
                [cartId, book_id, is_second_hand ? 1 : (quantity || 1), price, is_second_hand || false, sh_book_id || null]
            );
        } else {
             return res.status(400).json({ error: 'This unique second hand book is already in your cart' });
        }

        res.json({ message: 'Added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update quantity
router.put('/update/:itemId', authMiddleware, async (req, res) => {
    try {
        const { quantity } = req.body;
        
        // Ensure you cannot increase quantity of a second hand item
        const [cartItem] = await pool.query('SELECT is_second_hand FROM cart_items WHERE id = ?', [req.params.itemId]);
        if(cartItem.length && cartItem[0].is_second_hand && quantity > 1) {
             return res.status(400).json({ error: 'Cannot have multiple copies of a specific second-hand book' });
        }

        if (quantity <= 0) {
            await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.itemId]);
        } else {
            await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.itemId]);
        }
        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove item
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.itemId]);
        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
