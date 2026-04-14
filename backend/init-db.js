const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');

async function init() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS BookDrop;');
    console.log('Database BookDrop created or already exists');

    const schema = fs.readFileSync('./schema.sql', 'utf8');

    await connection.query('USE BookDrop;');

    const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);
    for (const query of queries) {
        await connection.query(query + ';');
    }

    console.log('Schema initialized successfully!');
    await connection.end();
}

init().catch(err => {
    console.error(err);
    process.exit(1);
});
