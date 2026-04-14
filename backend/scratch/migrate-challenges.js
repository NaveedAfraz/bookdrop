const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false } // Aiven often requires SSL
    });

    try {
        console.log('Adding target_category column to challenges...');
        await connection.query('ALTER TABLE challenges ADD COLUMN target_category VARCHAR(100) DEFAULT NULL;');
        console.log('Success!');
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column already exists.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        await connection.end();
    }
}

migrate();
