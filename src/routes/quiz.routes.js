import express from "express";
import {
    startQuiz,
    submitQuiz,
    getMyAttempts,
    getAttemptDetails,
} from "../controllers/quiz.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/start/:skill_id", authenticate, startQuiz);
router.post("/submit", authenticate, submitQuiz);
router.get("/attempts", authenticate, getMyAttempts);
router.get("/attempt/:id", authenticate, getAttemptDetails);

export default router;
