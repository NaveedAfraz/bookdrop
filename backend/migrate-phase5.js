const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('Running Phase 5 Migrations...');

    try {
        // 1. Update existing tables
        await connection.query("ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user';");
        console.log('Added role column to users');
    } catch (e) {
        console.log('users.role already exists.');
    }

    try {
        await connection.query("ALTER TABLE books ADD COLUMN country VARCHAR(100), ADD COLUMN published_year INT;");
        console.log('Added country and published_year columns to books');
    } catch (e) {
        console.log('books columns already exist.');
    }

    // 2. Create new tables
    const tables = [
        `CREATE TABLE IF NOT EXISTS reviews (
             id INT AUTO_INCREMENT PRIMARY KEY,
             book_id INT NOT NULL,
             name VARCHAR(255) DEFAULT 'Anonymous',
             review_text TEXT NOT NULL,
             rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
        );`,
        `CREATE TABLE IF NOT EXISTS refund_requests (
             id INT AUTO_INCREMENT PRIMARY KEY,
             user_id INT NOT NULL,
             book_id INT NOT NULL,
             order_id INT NOT NULL,
             reason TEXT NOT NULL,
             status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
             requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
             FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
             FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        );`,
        `CREATE TABLE IF NOT EXISTS courses (
             id INT AUTO_INCREMENT PRIMARY KEY,
             book_id INT NOT NULL,
             title VARCHAR(255) NOT NULL,
             video_url VARCHAR(255) NOT NULL,
             description TEXT,
             FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
        );`
    ];

    for (const query of tables) {
        try {
            await connection.query(query);
        } catch (e) {
            console.error('Error creating table:', e.message);
        }
    }

    // 3. Seed Admin User
    try {
        const email = 'admin@pageverse.com';
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await connection.query(
            "INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
            ['Admin User', email, hashedPassword]
        );
        console.log('Seeded default admin user: admin@pageverse.com / admin123');
    } catch (e) {
        console.log('Error seeding admin user:', e.message);
    }

    // 4. Update some books with data for Map and Time Machine if they exist
    try {
        await connection.query("UPDATE books SET country = 'United Kingdom', published_year = 1949 WHERE title LIKE '%1984%';");
        await connection.query("UPDATE books SET country = 'United States', published_year = 1925 WHERE title LIKE '%Gatsby%';");
        await connection.query("UPDATE books SET country = 'Colombia', published_year = 1967 WHERE title LIKE '%Solitude%';");
        console.log('Updated some sample books for Map/Time Machine demo.');
    } catch (e) {
        console.log('Error updating sample books:', e.message);
    }

    console.log('Phase 5 Migration Complete.');
    await connection.end();
}

migrate().catch(console.error);
