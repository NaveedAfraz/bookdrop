const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('Running Phase 3 Migrations...');

    try {
        await connection.query('ALTER TABLE cart_items ADD COLUMN is_second_hand BOOLEAN DEFAULT FALSE;');
    } catch (e) {
        console.log('cart_items is_second_hand already exists or error.');
    }
    try {
        await connection.query('ALTER TABLE cart_items ADD COLUMN sh_book_id INT NULL;');
    } catch (e) {
        console.log('cart_items sh_book_id already exists or error.');
    }

    try {
        await connection.query('ALTER TABLE order_items ADD COLUMN is_second_hand BOOLEAN DEFAULT FALSE;');
    } catch (e) {
        console.log('order_items is_second_hand already exists or error.');
    }
    try {
        await connection.query('ALTER TABLE order_items ADD COLUMN sh_book_id INT NULL;');
    } catch (e) {
        console.log('order_items sh_book_id already exists or error.');
    }

    console.log('Migration Complete.');
    await connection.end();
}

migrate().catch(console.error);
