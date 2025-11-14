import * as UserModel from "../models/user.model.js";
import logger from "../config/logger.js";

export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        logger.info(`Get all users: page=${page}, limit=${limit}, role=${role}, search=${search}`);
        const data = await UserModel.listUsers({ page, limit, role, search });
        return res.json(data);
    } catch (err) {
        logger.error(`Error fetching users: ${err && err.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        logger.info(`Get user by ID: ${userId}`);
        const user = await UserModel.getUserById(userId);
        if (!user) {
            logger.warn(`User not found: ${userId}`);
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (err) {
        logger.error(`Error fetching user by ID: ${err && err.message}`);
        res.status(500).json({ message: "Server error" });
    }
};
