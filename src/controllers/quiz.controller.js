import db from "../config/db.js";
import * as QuizModel from "../models/quiz.model.js";
import logger from "../config/logger.js";

export const startQuiz = async (req, res) => {
    try {
        const { skill_id } = req.params;
        const userId = req.user.id;

        const [questions] = await db.query(
            `SELECT id, question_text, option_a, option_b, option_c, option_d 
                FROM questions WHERE skill_id = ? ORDER BY RAND() LIMIT 5`,
            [skill_id]
        );

        if (!questions.length)
            return res.status(404).json({ message: "No questions found for this skill" });

        const attemptId = await QuizModel.startAttempt(
            userId,
            skill_id,
            questions.length
        );

        res.json({ attemptId, questions });
    } catch (err) {
        logger.error("Start quiz error:", err);
        res.status(500).json({ message: "Failed to start quiz" });
    }
};

export const submitQuiz = async (req, res) => {
    try {
        const { attemptId, answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: "Invalid answers format" });
        }

        const score = await QuizModel.submitQuiz(attemptId, answers);

        res.json({
            message: "Quiz submitted successfully",
            score
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to submit quiz" });
    }
};

export const getMyAttempts = async (req, res) => {
    try {
        const userId = req.user.id;
        const attempts = await QuizModel.getUserAttempts(userId);
        res.json(attempts);
    } catch (err) {
        logger.error("Get my attempts error:", err);
        res.status(500).json({ message: "Failed to fetch attempts" });
    }
};

export const getAttemptDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const details = await QuizModel.getAttemptDetails(id);
        res.json(details);
    } catch (err) {
        logger.error("Get attempt details error:", err);
        res.status(500).json({ message: "Failed to fetch attempt details" });
    }
};
