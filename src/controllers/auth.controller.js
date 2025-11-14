import * as UserModel from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import logger from "../config/logger.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        logger.info(`Register attempt: name=${name}, email=${email}`);
        if (!name || !email || !password) {
            logger.warn('Registration failed: missing fields');
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existing = await UserModel.getUserByEmail(email);
        if (existing) {
            logger.error(`Registration failed: email already registered (${email})`);
            return res.status(409).json({ message: "Email already registered" });
        }

        const newUser = await UserModel.createUser({ name, email, password });
        const token = generateToken(newUser);
        logger.info(`User registered: email=${email}, id=${newUser && newUser.id}`);
        return res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            token,
        });
    } catch (err) {
        logger.error(`Registration error: ${err && err.message}`);
        res.status(500).json({ message: "Server error during registration" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        logger.info(`Login attempt: email=${email}`);
        if (!email || !password) {
            logger.warn('Login failed: missing fields');
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            logger.warn(`Login failed: user not found (${email})`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const verifiedUser = await UserModel.verifyPassword(email, password);
        if (!verifiedUser) {
            logger.warn(`Login failed: invalid password (${email})`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(verifiedUser);
        logger.info(`Login successful: email=${email}, id=${verifiedUser && verifiedUser.id}`);
        return res.json({
            message: "Login successful",
            user: verifiedUser,
            token,
        });
    } catch (err) {
        logger.error(`Login error: ${err && err.message}`);
        res.status(500).json({ message: "Server error during login" });
    }
};
