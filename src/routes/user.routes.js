import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getAllUsers, getUserById } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("admin"), getAllUsers);
router.get("/:id", authenticate, getUserById);

export default router;