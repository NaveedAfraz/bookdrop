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

    console.log('Seeding Phase 4 Data...');

    try {
        await connection.query("INSERT IGNORE INTO challenges (id, title, description, book_count, duration_days, reward_points) VALUES (1, 'Sci-Fi Explorer', 'Read 5 Sci-Fi books this month.', 5, 30, 500)");
        await connection.query("INSERT IGNORE INTO challenges (id, title, description, book_count, duration_days, reward_points) VALUES (2, 'Mystery Solver', 'Read 3 Mystery/Thriller books.', 3, 30, 300)");
        await connection.query("INSERT IGNORE INTO challenges (id, title, description, book_count, duration_days, reward_points) VALUES (3, 'Non-Fiction Knowledge', 'Read 2 deep-dive non-fiction books.', 2, 60, 400)");
        console.log('Seeded challenges');
    } catch (e) { console.error(e); }

    try {
        await connection.query("INSERT IGNORE INTO bundles (id, title, description, discount_percent) VALUES (1, 'The Modern Classics', 'Essential reads for every modern library.', 20.00)");
        await connection.query("INSERT IGNORE INTO bundles (id, title, description, discount_percent) VALUES (2, 'Deep Space Collection', 'Three masterpieces of science fiction.', 25.00)");
        console.log('Seeded bundles');
    } catch (e) { console.error(e); }

    // Tie some books to bundles if they exist
    const [books] = await connection.query('SELECT id FROM books LIMIT 10');
    if (books.length >= 5) {
        try {
            await connection.query('INSERT IGNORE INTO bundle_books (bundle_id, book_id) VALUES (1, ?), (1, ?), (1, ?)', [books[0].id, books[1].id, books[2].id]);
            await connection.query('INSERT IGNORE INTO bundle_books (bundle_id, book_id) VALUES (2, ?), (2, ?)', [books[3].id, books[4].id]);
            console.log('Tied books to bundles');
        } catch (e) { console.log('Books already tied or failed'); }
    }

    console.log('Seeding Complete.');
    await connection.end();
}

seed().catch(console.error);
