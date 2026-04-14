const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/place', authMiddleware, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { address_id } = req.body;
        if (!address_id) throw new Error('Address is required');

        // Get Cart
        const [cart] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
        if (cart.length === 0) throw new Error('Cart empty');
        const cartId = cart[0].id;

        // Get Cart Items
        const [items] = await connection.query('SELECT book_id, quantity, price, is_second_hand, sh_book_id FROM cart_items WHERE cart_id = ?', [cartId]);
        if (items.length === 0) throw new Error('Cart is empty');

        let totalAmount = 0;
        let secondHandBookIds = [];

        // Check stock and calculate total
        for (const item of items) {
            if (item.is_second_hand) {
                const [shBooks] = await connection.query('SELECT status FROM second_hand_books WHERE id = ? FOR UPDATE', [item.sh_book_id]);
                if (shBooks.length === 0 || shBooks[0].status !== 'AVAILABLE') {
                    throw new Error(`Second hand book ${item.book_id} is no longer available.`);
                }
                secondHandBookIds.push(item.sh_book_id);
            } else {
                const [books] = await connection.query('SELECT stock FROM books WHERE id = ? FOR UPDATE', [item.book_id]);
                if (books.length === 0 || books[0].stock < item.quantity) {
                    throw new Error(`Insufficient stock for book ID ${item.book_id}`);
                }
            }
            totalAmount += parseFloat(item.price) * item.quantity;
        }

        // Calculate Bundle Discount
        let discountPercent = 0;
        if (items.length >= 10) discountPercent = 15;
        else if (items.length >= 5) discountPercent = 10;
        else if (items.length >= 3) discountPercent = 5;

        if (discountPercent > 0) {
            totalAmount = totalAmount * (1 - (discountPercent / 100));
        }

        // Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, address_id, total_amount, payment_status, order_status) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, address_id, totalAmount, 'SUCCESS', 'PROCESSING']
        );
        const orderId = orderResult.insertId;

        // Insert Order Items and Update Stock
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, book_id, quantity, price, is_second_hand, sh_book_id) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.book_id, item.quantity, item.price, item.is_second_hand, item.sh_book_id]
            );

            if (item.is_second_hand) {
                await connection.query('UPDATE second_hand_books SET status = ? WHERE id = ?', ['SOLD', item.sh_book_id]);
                
                // Retrieve user city
                const [addresses] = await connection.query('SELECT city FROM addresses WHERE id = ? LIMIT 1', [address_id]);
                const city = addresses.length > 0 ? addresses[0].city : 'Unknown';

                // Initial book_journey record indicating ownership start
                await connection.query(
                    'INSERT INTO book_journey (sh_book_id, owner_id, city) VALUES (?, ?, ?)',
                    [item.sh_book_id, req.user.id, city]
                );

            } else {
                await connection.query('UPDATE books SET stock = stock - ? WHERE id = ?', [item.quantity, item.book_id]);
                
                // Challenge Progress Increment
                // Only increment for challenges with a matching target_category, or if target_category is NULL (General)
                await connection.query(`
                    UPDATE user_challenges uc
                    JOIN challenges c ON uc.challenge_id = c.id
                    SET uc.books_read = uc.books_read + ? 
                    WHERE uc.user_id = ? 
                      AND uc.completed_at IS NULL
                      AND (c.target_category IS NULL OR c.target_category = (SELECT category FROM books WHERE id = ?))
                `, [item.quantity, req.user.id, item.book_id]);
            }
        }

        // Clear Cart
        await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

        await connection.commit();
        res.json({ message: 'Order placed successfully', orderId, secondHandBookIds, discountApplied: discountPercent });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        
        for (const order of orders) {
            const [items] = await pool.query(`
                SELECT oi.*, b.title, b.author, b.cover_image 
                FROM order_items oi 
                JOIN books b ON oi.book_id = b.id 
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Alias for frontend compatibility
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        
        for (const order of orders) {
            const [items] = await pool.query(`
                SELECT oi.*, b.title, b.author, b.cover_image 
                FROM order_items oi 
                JOIN books b ON oi.book_id = b.id 
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
