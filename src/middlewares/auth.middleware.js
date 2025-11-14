import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../config/logger.js";

dotenv.config();

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        logger.warn("Authentication failed: No token provided");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        logger.warn("Authentication failed: Invalid token format");
        return res.status(401).json({ message: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role }
        logger.info(`Authentication successful for user: ${decoded.email || decoded.id}`);
        next();
    } catch (err) {
        logger.error(`Token verification failed: ${err.message}`);
        return res.status(403).json({ message: "Token verification failed" });
    }
};