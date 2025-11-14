import express from "express";
import {
    startQuiz,
    submitQuiz,
    getMyAttempts,
    getAttemptDetails,
} from "../controllers/quiz.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/start", authenticate, startQuiz);
router.post("/submit", authenticate, submitQuiz);
router.get("/my", authenticate, getMyAttempts);
router.get("/:id", authenticate, getAttemptDetails);

export default router;
