import bcrypt from "bcrypt";
import db from "../config/db.js";

const SALT_ROUNDS = 10;

export async function getUserByEmail(email) {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );
    return rows[0] || null;
}

export async function getUserById(id) {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE id = ? LIMIT 1",
        [id]
    );
    return rows[0] || null;
}

export async function createUser({ name, email, password, role = "user" }) {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashed, role]
    );
    return getUserById(result.insertId);
}

export async function verifyPassword(email, plainPassword) {
    const user = await getUserByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) return null;
    const { password, ...rest } = user;
    return rest;
}

export async function listUsers() {
    const [rows] = await db.execute("SELECT id, name, email, role FROM users");
    return rows;
}

export default {
    getUserByEmail,
    getUserById,
    createUser,
    verifyPassword,
    listUsers,
};
