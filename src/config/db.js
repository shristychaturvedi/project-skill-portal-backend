
import logger from "./logger.js";
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();


const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

try {
    const connection = await db.getConnection();
    logger.info("MySQL Database connected successfully!");
    connection.release();
} catch (err) {
    logger.error("MySQL connection failed: " + err.message);
    process.exit(1);
}

export default db;
