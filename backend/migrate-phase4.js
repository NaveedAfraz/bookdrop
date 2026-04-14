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

    console.log('Running Phase 4 Migrations...');

    try {
        await connection.query('ALTER TABLE users ADD COLUMN points INT DEFAULT 0;');
        console.log('Added points column to users');
    } catch (e) {
        console.log('users.points already exists or error.');
    }

    const tables = `
        CREATE TABLE IF NOT EXISTS challenges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            book_count INT NOT NULL,
            duration_days INT NOT NULL,
            reward_points INT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS user_challenges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            challenge_id INT NOT NULL,
            books_read INT DEFAULT 0,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS bundles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            discount_percent DECIMAL(5,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS bundle_books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            bundle_id INT NOT NULL,
            book_id INT NOT NULL,
            FOREIGN KEY (bundle_id) REFERENCES bundles(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS read_together_rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            book_id INT NOT NULL,
            created_by INT NOT NULL,
            invite_code VARCHAR(10) UNIQUE NOT NULL,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS room_members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_id INT NOT NULL,
            user_id INT NOT NULL,
            current_chapter INT DEFAULT 1,
            FOREIGN KEY (room_id) REFERENCES read_together_rooms(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS room_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_id INT NOT NULL,
            user_id INT NOT NULL,
            message TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES read_together_rooms(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;

    const queries = tables.split(';').map(q => q.trim()).filter(q => q.length > 0);
    for (const query of queries) {
        try {
            await connection.query(query + ';');
        } catch (e) {
            console.error('Error executing query:', query, e.message);
        }
    }

    console.log('Phase 4 Migration Complete.');
    await connection.end();
}

migrate().catch(console.error);
