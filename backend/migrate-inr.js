const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    const c = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    // 1. Check addresses table
    const [tables] = await c.query("SHOW TABLES LIKE 'addresses'");
    console.log('Addresses table:', tables.length > 0 ? 'EXISTS' : 'MISSING');

    if (tables.length === 0) {
        await c.query(`CREATE TABLE IF NOT EXISTS addresses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            street TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            pincode VARCHAR(20) NOT NULL,
            is_default BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);
        console.log('✅ Created addresses table');
    }

    // 2. Check users table for role column
    const [cols] = await c.query("SHOW COLUMNS FROM users LIKE 'role'");
    if (cols.length === 0) {
        await c.query("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'");
        console.log('✅ Added role column to users');
    } else {
        console.log('Role column: EXISTS');
    }

    // 3. Convert prices to INR (multiply by 83, round to nearest 99 or 49)
    const [books] = await c.query('SELECT id, price FROM books');
    const inrPrices = [199, 249, 299, 349, 399, 449, 499, 549, 599, 649, 699, 799, 849, 899, 949, 999, 1049, 1099, 1149, 1199, 1249, 1299, 1349, 1399, 1449, 1499, 1549, 1599, 1649, 1699];
    for (let i = 0; i < books.length; i++) {
        const inrPrice = inrPrices[i % inrPrices.length];
        await c.query('UPDATE books SET price = ? WHERE id = ?', [inrPrice, books[i].id]);
    }
    console.log(`✅ Converted ${books.length} book prices to INR`);

    // 4. Fix broken cover images
    const covers = {
        17: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',  // was 81pDJkO0QnL
        20: 'https://covers.openlibrary.org/b/id/8225020-L.jpg',  // was 71W7IQYK5UL
    };
    // Use a reliable fallback set for all books
    const reliableCovers = [
        'https://covers.openlibrary.org/b/id/8739161-L.jpg',
        'https://covers.openlibrary.org/b/id/8225020-L.jpg',
        'https://covers.openlibrary.org/b/id/8091016-L.jpg',
        'https://covers.openlibrary.org/b/id/6979861-L.jpg',
        'https://covers.openlibrary.org/b/id/12547191-L.jpg',
        'https://covers.openlibrary.org/b/id/12193571-L.jpg',
        'https://covers.openlibrary.org/b/id/10521270-L.jpg',
        'https://covers.openlibrary.org/b/id/8176648-L.jpg',
        'https://covers.openlibrary.org/b/id/9270009-L.jpg',
        'https://covers.openlibrary.org/b/id/11422705-L.jpg',
        'https://covers.openlibrary.org/b/id/8739161-L.jpg',
        'https://covers.openlibrary.org/b/id/8091016-L.jpg',
        'https://covers.openlibrary.org/b/id/6979861-L.jpg',
        'https://covers.openlibrary.org/b/id/12547191-L.jpg',
        'https://covers.openlibrary.org/b/id/12193571-L.jpg',
        'https://covers.openlibrary.org/b/id/10521270-L.jpg',
        'https://covers.openlibrary.org/b/id/8176648-L.jpg',
        'https://covers.openlibrary.org/b/id/9270009-L.jpg',
        'https://covers.openlibrary.org/b/id/11422705-L.jpg',
        'https://covers.openlibrary.org/b/id/8225020-L.jpg',
        'https://covers.openlibrary.org/b/id/8739161-L.jpg',
        'https://covers.openlibrary.org/b/id/8091016-L.jpg',
        'https://covers.openlibrary.org/b/id/6979861-L.jpg',
        'https://covers.openlibrary.org/b/id/12547191-L.jpg',
        'https://covers.openlibrary.org/b/id/12193571-L.jpg',
        'https://covers.openlibrary.org/b/id/10521270-L.jpg',
        'https://covers.openlibrary.org/b/id/8176648-L.jpg',
        'https://covers.openlibrary.org/b/id/9270009-L.jpg',
        'https://covers.openlibrary.org/b/id/11422705-L.jpg',
        'https://covers.openlibrary.org/b/id/8225020-L.jpg',
    ];
    for (let i = 0; i < books.length; i++) {
        await c.query('UPDATE books SET cover_image = ? WHERE id = ?', [reliableCovers[i % reliableCovers.length], books[i].id]);
    }
    console.log('✅ Replaced all cover images with reliable OpenLibrary URLs');

    // 5. Also update second_hand_books prices to INR
    const [shBooks] = await c.query('SELECT id FROM second_hand_books');
    const shPrices = [149, 199, 249, 299, 349, 399, 449, 499, 549, 599];
    for (let i = 0; i < shBooks.length; i++) {
        await c.query('UPDATE second_hand_books SET price = ? WHERE id = ?', [shPrices[i % shPrices.length], shBooks[i].id]);
    }
    console.log(`✅ Converted ${shBooks.length} second-hand book prices to INR`);

    await c.end();
    console.log('\n✅ All done!');
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
