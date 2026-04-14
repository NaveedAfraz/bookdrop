const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('Seeding Phase 5 Sample Data...');

    try {
        // 1. Seed Courses
        const [books] = await connection.query('SELECT id FROM books LIMIT 3');
        if (books.length > 0) {
            const queries = books.map((b, i) => [
                b.id, 
                `Masterclass: Understanding ${i === 0 ? '1984' : i === 1 ? 'Gatsby' : 'Solitude'}`,
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Classic placeholder
                'A deep dive into the themes, symbolism, and historical context of this masterpiece. Led by world-class literary scholars.'
            ]);

            for (const q of queries) {
                await connection.query(
                    'INSERT IGNORE INTO courses (book_id, title, video_url, description) VALUES (?, ?, ?, ?)',
                    q
                );
            }
            console.log('Seeded sample courses.');
        }

        // 2. Seed Reviews
        if (books.length > 0) {
            const reviews = [
                [books[0].id, 'Winston Smith', 'A chilling prophecy that feels more relevant every day. 10/10 recommend.', 5],
                [books[0].id, 'Julia', 'Terrifyingly beautiful prose. Changed my perspective on privacy.', 4],
                [books[1].id, 'Nick Carraway', 'The Great American Novel. The parties, the tragedy, the green light.', 5],
            ];

            for (const r of reviews) {
                await connection.query(
                    'INSERT INTO reviews (book_id, name, review_text, rating) VALUES (?, ?, ?, ?)',
                    r
                );
            }
            console.log('Seeded sample reviews.');
        }

        // 3. Seed Refund Request (Needs an order)
        const [orders] = await connection.query('SELECT id, user_id FROM orders LIMIT 1');
        if (orders.length > 0 && books.length > 0) {
            await connection.query(
                'INSERT INTO refund_requests (user_id, book_id, order_id, reason, status) VALUES (?, ?, ?, ?, ?)',
                [orders[0].user_id, books[0].id, orders[0].id, 'Accidental duplicate purchase. Please refund this item.', 'PENDING']
            );
            console.log('Seeded sample refund request.');
        }

    } catch (e) {
        console.error('Seeding error:', e.message);
    }

    console.log('Phase 5 Seeding Complete.');
    await connection.end();
}

seed().catch(console.error);
