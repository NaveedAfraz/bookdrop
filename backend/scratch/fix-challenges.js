const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await conn.query(`UPDATE challenges SET target_category = 'Fantasy' WHERE title = 'Sci-Fi September'`);
        await conn.query(`UPDATE challenges SET target_category = 'Self-help' WHERE title = 'Philosophy Quest'`);
        await conn.query(`UPDATE challenges SET target_category = 'Non-fiction' WHERE title = 'Non-Fiction Deep Dive'`);
        await conn.query(`UPDATE challenges SET target_category = 'Fiction' WHERE title = 'Thriller Weekend'`);
        console.log('Categories updated successfully!');
    } catch (e) {
        console.error(e);
    } finally {
        await conn.end();
    }
}
fix();
